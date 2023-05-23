import { TAdapterMethodParam, WalletConnectNeo3Adapter } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { plainToClass } from 'class-transformer'

import { WalletConnectHelper } from '../helpers/WalletConnectHelper'
import { Account } from '../models/redux/Account'
import { RootStore } from '../store/RootStore'

export class WalletConnectNeonAdapter extends WalletConnectNeo3Adapter {
  async getAccountString({ session }: TAdapterMethodParam): Promise<string> {
    const {
      account: { data: accounts },
    } = RootStore.store.getState()

    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)
    const account = accounts.find(account => account.address === address)
    if (!account) throw new Error('Account not found')

    const accountClass = plainToClass(Account, account)

    const wif = await accountClass.getWif()
    if (!wif) throw new Error('WIF not found')

    return wif
  }

  async getWalletInfo(): Promise<any> {
    return {
      isLedger: false,
    }
  }

  async getRPCUrl({ session }: TAdapterMethodParam): Promise<string> {
    const {
      settings: { selectedBlockchainNetworks },
    } = RootStore.store.getState()

    const [{ blockchain }] = WalletConnectHelper.getAccountInformationFromSession(session)

    return selectedBlockchainNetworks[blockchain].url
  }
}
