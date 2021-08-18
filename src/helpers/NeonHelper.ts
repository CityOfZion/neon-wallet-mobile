import {api, nep5} from '@cityofzion/neon-js'
import moment from 'moment'
import {showMessage} from 'react-native-flash-message'

import {
  DoInvokeConfig,
  SendAssetConfig,
} from '../../node_modules/@cityofzion/neon-api/lib/funcs/types'
import {tx} from '../../node_modules/@cityofzion/neon-core'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Settings} from '~src/models/redux/Settings'
export abstract class NeonHelper {
  /**
   * Only GAS or NEO
   */
  static async sendNativeAsset(
    senderAddress: string,
    receiverAddress: string,
    asset: 'GAS' | 'NEO',
    amount: number,
    fees?: number,
    tipAmount?: number,
    tipReceiverAddress?: string
  ) {
    const settings = (await Storage.settings.load()) ?? new Settings()
    const accounts = (await Storage.accounts.load()) ?? []

    const account = accounts.find((it) => it.address === senderAddress)
    const neoAccount = await account?.getNeoAccount()
    const listUrls = (await NeoNode.getAllNodes()).map((node) => node.url)

    let intents: tx.TransactionOutput[]

    if (tipAmount && tipReceiverAddress) {
      const tipIntent = api.makeIntent({GAS: tipAmount}, tipReceiverAddress)
      const assetIntent = api.makeIntent({[asset]: amount}, receiverAddress)
      intents = assetIntent.concat(tipIntent)
    } else {
      intents = api.makeIntent({[asset]: amount}, receiverAddress)
    }

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const sendResponse = new Promise<SendAssetConfig>(
      async (resolve, reject) => {
        let stopSend = true
        for (let i = 0; i < listUrls.length; i++) {
          if (!stopSend) {
            break
          }
          const url = listUrls[i]
          if (url) {
            setTimeout(async () => {
              try {
                const sendResponse = await api.sendAsset({
                  url,
                  account: neoAccount,
                  api: apiProvider,
                  intents,
                  fees,
                })
                stopSend = true
                resolve(sendResponse)
              } catch (error) {
                reject(error)
                throw new Error(error.message)
              }
            }, 8000)
          }
        }
      }
    )

    return (await sendResponse).tx?.hash ?? null
  }

  static async getHash(
    senderAddress: string,
    asset: string,
    amount: number,
    receiverAddress: string,
    fees?: number
  ) {
    const settings = (await Storage.settings.load()) ?? new Settings()
    const accounts = (await Storage.accounts.load()) ?? []

    const account = accounts.find((it) => it.address === senderAddress)
    const neoAccount = await account?.getNeoAccount()
    const url =
      (await NeoNode.getHighestNodeUrl()) ?? settings.network.defaultNodeNet

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const intents = api.makeIntent({[asset]: amount}, receiverAddress)
    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }
    const assetsConfig: SendAssetConfig = {
      account: neoAccount,
      api: apiProvider,
      url,
      intents,
      fees,
    }
    return assetsConfig.tx?.hash ?? 'sem hash'
  }

  static async sendNep5Asset(
    senderAddress: string,
    receiverAddress: string,
    token: TokenAsset,
    fees?: number,
    tipAmount?: number,
    tipReceiverAddress?: string
  ) {
    const settings = (await Storage.settings.load()) ?? new Settings()
    const accounts = (await Storage.accounts.load()) ?? []

    const account = accounts.find((it) => it.address === senderAddress)
    const neoAccount = await account?.getNeoAccount()
    const url =
      (await NeoNode.getHighestNodeUrl()) ?? settings.network.defaultNodeNet

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const scBuilder = nep5.abi.transfer(
      token.hash,
      neoAccount.address,
      receiverAddress,
      token.amount
    )

    let invokeResponse: DoInvokeConfig

    if (tipAmount && tipReceiverAddress) {
      const tipIntent = api.makeIntent({GAS: tipAmount}, tipReceiverAddress)
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees,
        intents: tipIntent,
      })
    } else {
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees,
      })
    }

    Facade.bus.emit('transactionStart', invokeResponse)

    return invokeResponse.tx?.hash ?? null
  }

  static async claimGas(address: string) {
    const settings = (await Storage.settings.load()) ?? new Settings()
    const accounts = (await Storage.accounts.load()) ?? []

    const account = accounts.find((it) => it.address === address)

    const neoAccount = await account?.getNeoAccount()

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const request = Facade.app.blockchainDataProvider
    const response = await request.getBalance(address)
    const balance = response.balance.find((it) => it.assetSymbol === 'NEO')
    const amount = balance?.amount ?? null
    const requiresTransaction = Boolean(amount)

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const lastClaimedTransaction =
      account?.flattedAllTransactions.find(
        (it) =>
          it.senderAddress === ('claim' || 'mint') ||
          it.receiverAddress === ('claim' || 'mint')
      ) ?? null

    const nextClaimAllowed = lastClaimedTransaction?.sentAt
      ? moment(lastClaimedTransaction.sentAt).add(5, 'minutes')
      : null

    // NW-473 After you claim gas, you have to wait 5 minutes to claim again
    if (nextClaimAllowed && moment().isBefore(nextClaimAllowed)) {
      showMessage({
        message: Facade.t('toast.gasClaimGapError'),
        type: 'danger',
      })
      throw new Error(Facade.t('toast.gasClaimGapError'))
    }

    if (requiresTransaction) {
      try {
        const txid = await this.sendNativeAsset(
          address,
          address,
          'NEO',
          amount ?? 0
        )

        this.watchTransaction(txid ?? '', () => {
          Facade.bus.emit('claimGasReady')
        })
      } catch (error) {
        showMessage({message: 'Problem to send native asset', type: 'danger'})
        Facade.bus.emit('ClaimGasFinished')
        throw new Error('Problem to send native asset')
      }
    }

    return new Promise<string | null>((resolve) => {
      const fetch = async () => {
        try {
          const claimGasResponse = await api.claimGas({
            api: apiProvider,
            account: neoAccount,
          })

          Facade.bus.emit('claimGasStart', claimGasResponse)
          resolve(claimGasResponse.response?.txid ?? null)
        } catch (error) {
          showMessage({
            message: 'Problem to get claim gas information',
            type: 'danger',
          })
          Facade.bus.emit('ClaimGasFinished')
          throw new Error('Problem to get claim gas information')
        }
      }

      // If a NEO transaction was made them it must wait this transaction
      if (requiresTransaction) {
        // Wait until claim gas is ready to start
        Facade.bus.off('claimGasReady', fetch)
        Facade.bus.on('claimGasReady', fetch)
      } else {
        fetch()
      }
    })
  }

  static async watchTransaction(
    txid: string,
    onComplete?: () => void,
    maxAttempts = 10,
    intervalInMs = 3000
  ) {
    await Facade.utils.sleep(intervalInMs)

    try {
      const request = Facade.app.blockchainDataProvider
      await request.getTransaction(txid)

      if (onComplete) onComplete()
    } catch {
      if (maxAttempts > 0) {
        await this.watchTransaction(
          txid,
          onComplete,
          maxAttempts - 1,
          intervalInMs
        )
      }
    }
  }
}
