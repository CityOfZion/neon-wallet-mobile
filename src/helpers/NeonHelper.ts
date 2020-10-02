import {api, nep5} from '@cityofzion/neon-js'

import {Storage} from '~src/app/Storage'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Settings} from '~src/models/redux/Settings'
import {AddressRequest} from '~src/models/request/AddressRequest'
import {Facade} from '~src/app/Facade'

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

    const apiProvider = new api.neoscan.instance(
      settings.network.networkDeprecatedLabel
    )

    if (amount) {
      await this.sendNativeAsset(address, address, 'NEO', amount)
      await Facade.utils.sleep(45000)
    }

    const claimGasResponse = await api.claimGas({
      api: apiProvider,
      account: neoAccount,
    })

    Facade.bus.emit('claimGasStart', claimGasResponse)

    return claimGasResponse.response?.txid ?? null
  }
}
