import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {Wallet} from '~src/models/redux/Wallet'
import {Account} from '~src/models/redux/Account'

export declare global {
  type AppType = 'SET_WALLETS' | 'SET_ACCOUNTS'

  interface AppState {
    wallets: Wallet[]
    accounts: Account[]
  }

  type AppAction = AppState & Action<AppType>

  type AppReducer = ReducerApplied<AppState, AppAction>
}
