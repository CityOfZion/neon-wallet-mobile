import {Dispatch} from 'redux'

import {RootStore} from '~src/store/RootStore'

export abstract class Sync {
  static async init(dispatch: Dispatch<any>) {
    dispatch(RootStore.settings.actions.syncSettings())
    dispatch(RootStore.app.actions.syncWallets())
    dispatch(RootStore.app.actions.syncAccounts())
  }
}
