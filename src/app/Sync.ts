import { AsyncDispatch } from '../types/reducers/root'

import { Node } from '~src/models/Node'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { App } from '~src/models/redux/App'
import { Contact } from '~src/models/redux/Contact'
import { Settings } from '~src/models/redux/Settings'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStore } from '~src/store/RootStore'
export type SyncResult = {
  settings: Settings
} & App

export abstract class Sync {
  static async init(dispatch: AsyncDispatch<any>): Promise<SyncResult> {
    const settings: Settings = await dispatch(RootStore.settings.actions.syncSettings())
    const tokens: TokenAsset[] = await dispatch(RootStore.app.actions.syncTokens())

    const nodes: Node[] = await dispatch(RootStore.app.actions.syncNodes())

    const wallets: Wallet[] = await dispatch(RootStore.app.actions.syncWallets())

    const accounts: Account[] = await dispatch(RootStore.app.actions.syncAccounts())

    const contacts: Contact[] = await dispatch(RootStore.app.actions.syncContacts())

    await dispatch(RootStore.app.actions.syncTokenAssets())

    await dispatch(RootStore.app.actions.syncBackupAlerts())

    return {
      settings,
      tokens,
      nodes,
      wallets,
      accounts,
      contacts,
    }
  }

  static async refresh(dispatch: AsyncDispatch<any>) {
    const promises = [
      dispatch(RootStore.app.actions.syncTokens()),
      dispatch(RootStore.app.actions.syncNodes()),
      dispatch(RootStore.app.actions.syncTokenAssets()),
    ]

    await Promise.all(promises)
  }

  static async fetchs(dispatch: AsyncDispatch<any>) {
    const promises = [
      dispatch(RootStore.app.actions.fetchTokens()),
      dispatch(RootStore.app.actions.fetchBalanceAccounts()),
      dispatch(RootStore.app.actions.fetchNodes()),
    ]

    await Promise.all(promises)
  }
}
