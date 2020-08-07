import {api, nep5} from '@cityofzion/neon-js'

import {Storage} from '~src/app/Storage'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'

export abstract class NeonHelper {
  /**
   * Only GAS or NEO
   */
  static async sendNativeAsset(
    account: Account,
    receiverAddress: string,
    asset: 'GAS' | 'NEO',
    amount: number,
    fees?: number
  ) {
    const settings = await Storage.settings.load()
    const neoAccount = await account.getNeoAccount()
    const intents = api.makeIntent({[asset]: amount}, receiverAddress)

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(
      settings?.network.networkDeprecatedLabel ?? ''
    )

    const sendResponse = await api.sendAsset({
      account: neoAccount,
      api: apiProvider,
      url: settings?.network.nodeNet,
      intents,
      fees,
    })

    return sendResponse.tx?.hash ?? null
  }

  static async sendNep5Asset(
    account: Account,
    receiverAddress: string,
    token: TokenAsset,
    fees?: number
  ) {
    const settings = await Storage.settings.load()
    const neoAccount = await account.getNeoAccount()

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(
      settings?.network.networkDeprecatedLabel ?? ''
    )

    const scBuilder = nep5.abi.transfer(
      token.hash,
      neoAccount.address,
      receiverAddress,
      token.amount
    )

    const invokeResponse = await api.doInvoke({
      api: apiProvider,
      url: settings?.network.nodeNet,
      account: neoAccount,
      script: scBuilder().str,
      fees,
    })

    return invokeResponse.tx?.hash ?? null
  }
}
