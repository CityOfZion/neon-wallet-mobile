import {combineReducers} from 'redux'

import {AccountReducer} from '~src/store/account/AccountReducer'
import {AppReducer} from '~src/store/app/AppReducer'
import {ContactsReducer} from '~src/store/contacts/ContactsReducer'
import {LoadingReducer} from '~src/store/loading/LoadingReducer'
import {SettingsReducer} from '~src/store/settings/SettingsReducer'
import {WalletReducer} from '~src/store/wallet/WalletReducer'

export type RootState = ReturnType<typeof RootStore.reducers>

export abstract class RootStore {
  static readonly app = new AppReducer()
  static readonly settings = new SettingsReducer()
  static readonly wallet = new WalletReducer()
  static readonly account = new AccountReducer()
  static readonly loading = new LoadingReducer()
  static readonly contacts = new ContactsReducer()

  static readonly reducers = combineReducers({
    app: RootStore.app.reducer,
    settings: RootStore.settings.reducer,
    wallet: RootStore.wallet.reducer,
    account: RootStore.account.reducer,
    loading: RootStore.loading.reducer,
    contacts: RootStore.contacts.reducer,
  })
}
