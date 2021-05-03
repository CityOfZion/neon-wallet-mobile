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
    await dispatch(RootStore.app.actions.syncNetworkStatus())
    console.log('sync network ok')
    const settings: Settings = await dispatch(
      RootStore.settings.actions.syncSettings()
    )
    console.log('sync settings ok')
    const exchange: Exchange = await dispatch(
      RootStore.app.actions.syncExchange()
    )
    console.log('sync exchange ok')
    const tokens: TokenAsset[] = await dispatch(
      RootStore.app.actions.syncTokens()
    )
    console.log('sync tokens ok')
    const nodes: NeoNode[] = await dispatch(RootStore.app.actions.syncNodes())
    console.log('sync nodes ok')
    const wallets: Wallet[] = await dispatch(
      RootStore.app.actions.syncWallets()
    )
    console.log('sync wallets ok')
    const accounts: Account[] = await dispatch(
      RootStore.app.actions.syncAccounts()
    )
    console.log('sync accounts ok')
    const contacts: Contact[] = await dispatch(
      RootStore.app.actions.syncContacts()
    )
    console.log('sync contacts ok')
    const preAccount: Account | null = await dispatch(
      RootStore.app.actions.syncPreAccount()
    )
    console.log('sync preaccount ok')

    await dispatch(RootStore.app.actions.syncTokenAssets())
    console.log('sync token assets ok')
    await dispatch(RootStore.app.actions.syncBackupAlerts())
    console.log('sync backup ok')

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

  static async fetchs(dispatch: AsyncDispatch<any>) {
    const promises = [
      dispatch(RootStore.app.actions.fetchExchange()),
      dispatch(RootStore.app.actions.fetchTokens()),
      dispatch(RootStore.app.actions.fetchNodes()),
      dispatch(RootStore.app.actions.fetchBalanceAccounts()),
    ]

    await Promise.all(promises)
  }
}
