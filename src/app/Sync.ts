import {App} from '~src/models/redux/App'
import {Settings} from '~src/models/redux/Settings'
import {RootStore} from '~src/store/RootStore'

export type SyncResult = {
  settings: Settings
} & App

export abstract class Sync {
  static async init(dispatch: AsyncDispatch<any>): Promise<SyncResult> {
    const settings = await dispatch(RootStore.settings.actions.syncSettings())
    const wallets = await dispatch(RootStore.app.actions.syncWallets())
    const accounts = await dispatch(RootStore.app.actions.syncAccounts())

    return {settings, wallets, accounts}
  }
}
