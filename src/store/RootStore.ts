import { combineReducers } from 'redux'

import { AccountReducer } from '~src/store/account/AccountReducer'
import { AppReducer } from '~src/store/app/AppReducer'
import { ContactReducer } from '~src/store/contact/ContactReducer'
import { LoadingReducer } from '~src/store/loading/LoadingReducer'
import { NetworkReducer } from '~src/store/network/NetworkReducer'
import { SettingsReducer } from '~src/store/settings/SettingsReducer'
import { WalletReducer } from '~src/store/wallet/WalletReducer'
import { WalletConnectReducer } from '~src/store/walletConnect/WalletConnectReducer'
export type RootState = ReturnType<typeof RootStore.reducers>

export abstract class RootStore {
  static readonly app = new AppReducer()
  static readonly settings = new SettingsReducer()
  static readonly wallet = new WalletReducer()
  static readonly account = new AccountReducer()
  static readonly loading = new LoadingReducer()
  static readonly contact = new ContactReducer()
  static readonly wcReducer = new WalletConnectReducer()
  static readonly network = new NetworkReducer()

  static readonly reducers = combineReducers({
    app: RootStore.app.reducer,
    settings: RootStore.settings.reducer,
    wallet: RootStore.wallet.reducer,
    account: RootStore.account.reducer,
    loading: RootStore.loading.reducer,
    contact: RootStore.contact.reducer,
    network: RootStore.network.reducer,
    wcReducer: RootStore.wcReducer.reducer,
  })
}
