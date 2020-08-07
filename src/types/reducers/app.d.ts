import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {Wallet} from '~src/models/redux/Wallet'
import {Account} from '~src/models/redux/Account'
import {Exchange} from '~src/types/exchange'
import {Contact} from '~src/models/redux/Contact'
import {TokenAsset} from '~src/models/TokenAsset'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

export declare global {
  type AppActionsType =
    | 'SET_EXCHANGE'
    | 'SET_WALLETS'
    | 'SET_ACCOUNTS'
    | 'SET_CONTACTS'
    | 'SET_TOKENS'
    | 'SET_PENDING_TRANSACTIONS'

  interface AppState {
    exchange: Exchange
    wallets: Wallet[]
    accounts: Account[]
    contacts: Contact[]
    tokens: TokenAsset[]
    pendingTransactions: SenderTransaction[]
  }

  type AppAction = AppState & Action<AppActionsType>

  type AppReducer = ReducerApplied<AppState, AppAction>
}
