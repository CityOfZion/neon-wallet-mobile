import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {App} from '~src/models/redux/App'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {Settings} from '~src/models/redux/Settings'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStore} from '~src/store/RootStore'
import {Exchange} from '~src/types/exchange'

export type SyncResult = {
  settings: Settings
} & App

export abstract class Sync {
  static async init(dispatch: AsyncDispatch<any>): Promise<SyncResult> {
    const settings: Settings = await dispatch(
      RootStore.settings.actions.syncSettings()
    )

    const exchange: Exchange = await dispatch(
      RootStore.app.actions.syncExchange()
    )
    const wallets: Wallet[] = await dispatch(
      RootStore.app.actions.syncWallets()
    )
    const accounts: Account[] = await dispatch(
      RootStore.app.actions.syncAccounts()
    )
    const contacts: Contact[] = await dispatch(
      RootStore.app.actions.syncContacts()
    )
    const tokens: TokenAsset[] = await dispatch(
      RootStore.app.actions.syncTokens()
    )
    const pendingTransactions: SenderTransaction[] = await dispatch(
      RootStore.app.actions.syncPendingTransactions()
    )

    // Synchronize balance from WS
    const promises = accounts.map((it) => it.populateBalanceTokens())
    await Promise.all(promises)

    return {
      settings,
      exchange,
      wallets,
      accounts,
      contacts,
      tokens,
      pendingTransactions,
    }
  }
}
