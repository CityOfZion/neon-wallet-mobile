import {api, nep5} from '@cityofzion/neon-js'
import moment from 'moment'
import {showMessage} from 'react-native-flash-message'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Settings} from '~src/models/redux/Settings'
import {AddressRequest} from '~src/models/request/AddressRequest'
import {TransactionRequest} from '~src/models/request/TransactionRequest'

export abstract class NeonHelper {
  /**
   * Only GAS or NEO
   */
  static async sendNativeAsset(
    senderAddress: string,
    receiverAddress: string,
    asset: 'GAS' | 'NEO',
    amount: number,
    fees?: number
  ) {
    const settings = (await Storage.settings.load()) ?? new Settings()
    const accounts = (await Storage.accounts.load()) ?? []

    const account = accounts.find((it) => it.address === senderAddress)
    const neoAccount = await account?.getNeoAccount()
    const url =
      (await NeoNode.getHighestNodeUrl()) ?? settings.network.defaultNodeNet

    const intents = api.makeIntent({[asset]: amount}, receiverAddress)

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const sendResponse = await api.sendAsset({
      account: neoAccount,
      api: apiProvider,
      url,
      intents,
      fees,
    })

    Facade.bus.emit('transactionStart', sendResponse)

    return sendResponse.tx?.hash ?? null
  }

  static async sendNep5Asset(
    senderAddress: string,
    receiverAddress: string,
    token: TokenAsset,
    fees?: number
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

    const invokeResponse = await api.doInvoke({
      api: apiProvider,
      url,
      account: neoAccount,
      script: scBuilder().str,
      fees,
    })

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

    const request = new AddressRequest(address)
    const response = await request.getBalance()
    const balance = response.balance.find((it) => it.assetSymbol === 'NEO')
    const amount = balance?.amount ?? null
    const requiresTransaction = Boolean(amount)

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    const lastClaimedTransaction =
      account?.flattedAllTransactions.find(
        (it) => it.senderAddress === 'claim' || it.receiverAddress === 'claim'
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
      const txid = await this.sendNativeAsset(
        address,
        address,
        'NEO',
        amount ?? 0
      )

      this.watchTransaction(txid ?? '', () => {
        Facade.bus.emit('claimGasReady')
      })
    }

    return new Promise<string | null>((resolve) => {
      const fetch = async () => {
        const claimGasResponse = await api.claimGas({
          api: apiProvider,
          account: neoAccount,
        })

        Facade.bus.emit('claimGasStart', claimGasResponse)

        resolve(claimGasResponse.response?.txid ?? null)
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
      const request = new TransactionRequest(txid)
      await request.getTransaction()

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
