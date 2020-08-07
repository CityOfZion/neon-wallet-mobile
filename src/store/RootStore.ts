import {combineReducers} from 'redux'

import {AccountReducer} from '~src/store/account/AccountReducer'
import {AppReducer} from '~src/store/app/AppReducer'
import {ContactReducer} from '~src/store/contact/ContactReducer'
import {LoadingReducer} from '~src/store/loading/LoadingReducer'
import {SendTransactionReducer} from '~src/store/senderTransaction/SendTransactionReducer'
import {SettingsReducer} from '~src/store/settings/SettingsReducer'
import {WalletReducer} from '~src/store/wallet/WalletReducer'

export type RootState = ReturnType<typeof RootStore.reducers>

export abstract class RootStore {
  static readonly app = new AppReducer()
  static readonly settings = new SettingsReducer()
  static readonly wallet = new WalletReducer()
  static readonly account = new AccountReducer()
  static readonly loading = new LoadingReducer()
  static readonly contact = new ContactReducer()
  static readonly senderTransaction = new SendTransactionReducer()

  static readonly reducers = combineReducers({
    app: RootStore.app.reducer,
    settings: RootStore.settings.reducer,
    wallet: RootStore.wallet.reducer,
    account: RootStore.account.reducer,
    loading: RootStore.loading.reducer,
    contact: RootStore.contact.reducer,
    senderTransaction: RootStore.senderTransaction.reducer,
  })
}
