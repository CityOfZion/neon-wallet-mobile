import {combineReducers} from 'redux'

import {AppReducer} from '~src/store/app/AppReducer'
import {LoadingReducer} from '~src/store/loading/LoadingReducer'
import {WalletReducer} from '~src/store/wallet/WalletReducer'

export type RootState = ReturnType<typeof RootStore.reducers>

export abstract class RootStore {
  static readonly app = new AppReducer()
  static readonly loading = new LoadingReducer()
  static readonly wallet = new WalletReducer()

  static readonly reducers = combineReducers({
    app: RootStore.app.reducer,
    loading: RootStore.loading.reducer,
    wallet: RootStore.wallet.reducer,
  })
}
