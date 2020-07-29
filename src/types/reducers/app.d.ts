import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {Wallet} from '~src/models/redux/Wallet'
import {Account} from '~src/models/redux/Account'
import {Exchange} from '~src/types/exchange'
import {Contact} from '~src/models/redux/Contact'

export declare global {
  type AppType =
    | 'SET_EXCHANGE'
    | 'SET_WALLETS'
    | 'SET_ACCOUNTS'
    | 'SET_CONTACTS'

  interface AppState {
    exchange: Exchange
    wallets: Wallet[]
    accounts: Account[]
    contacts: Contact[]
  }

  type AppAction = AppState & Action<AppType>

  type AppReducer = ReducerApplied<AppState, AppAction>
}
