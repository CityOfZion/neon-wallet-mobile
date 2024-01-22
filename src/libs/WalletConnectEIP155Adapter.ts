import { TAdapterMethodParam, AbstractWalletConnectEIP155Adapter } from '@cityofzion/wallet-connect-sdk-wallet-react'

import { WalletConnectHelper } from '../helpers/WalletConnectHelper'
import { RootStore } from '../store/RootStore'
import { Account } from '../store/account/Account'

export class WalletConnectEIP155Adapter extends AbstractWalletConnectEIP155Adapter {
  async getAccountString({ session }: TAdapterMethodParam): Promise<string> {
    const {
      account: { data: accounts },
    } = RootStore.store.getState()

    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)
    const account = accounts.find(account => account.address === address)
    if (!account) throw new Error('Account not found')

    const accountClass = new Account(account)

    const key = await accountClass.getKey()
    if (!key) throw new Error('Key not found')

    return key
  }

  async getRPCUrl({ session }: TAdapterMethodParam): Promise<string> {
    const {
      blockchain: { bsAggregator },
    } = RootStore.store.getState()

    const [{ blockchain }] = WalletConnectHelper.getAccountInformationFromSession(session)

    return bsAggregator.getBlockchainByName(blockchain).network.url
  }
}
