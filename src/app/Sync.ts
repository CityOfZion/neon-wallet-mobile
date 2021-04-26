import {NeoNode} from '~src/models/NeoNode'
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
      RootStore.app.actions.syncExchange() //makes a request to sync state
    )
    const tokens: TokenAsset[] = await dispatch(
      RootStore.app.actions.syncTokens() //makes a request to sync state but have a treatment in failed case
    )
    const nodes: NeoNode[] = await dispatch(RootStore.app.actions.syncNodes()) //makes a request to sync state
    const wallets: Wallet[] = await dispatch(
      RootStore.app.actions.syncWallets()
    )
    const accounts: Account[] = await dispatch(
      RootStore.app.actions.syncAccounts()
    )
    const contacts: Contact[] = await dispatch(
      RootStore.app.actions.syncContacts()
    )
    const preAccount: Account | null = await dispatch(
      RootStore.app.actions.syncPreAccount()
    )

    await dispatch(RootStore.app.actions.syncTokenAssets()) //everything need request balance and don´t presist data in storage

    await dispatch(RootStore.app.actions.syncBackupAlerts())

    return {
      settings,
      exchange,
      tokens,
      nodes,
      wallets,
      accounts,
      contacts,
      preAccount,
    }
  }

  static async refresh(dispatch: AsyncDispatch<any>) {
    const promises = [
      dispatch(RootStore.app.actions.syncExchange()),
      dispatch(RootStore.app.actions.syncTokens()),
      dispatch(RootStore.app.actions.syncNodes()),
      dispatch(RootStore.app.actions.syncTokenAssets()),
      dispatch(RootStore.app.actions.syncPendingTransactions()),
    ]

    await Promise.all(promises)
  }
}
