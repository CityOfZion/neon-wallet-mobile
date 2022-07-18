import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { Wallet } from '~src/models/redux/Wallet'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'

export type AppActionsType =
  | 'SET_WALLETS'
  | 'SET_ACCOUNTS'
  | 'SET_CONTACTS'
  | 'SET_PENDING_TRANSACTIONS'
  | 'SET_PRE_ACCOUNT_CREATE'

export interface AppState {
  wallets: Wallet[]
  accounts: Account[]
  contacts: Contact[]
}

export type AppAction = AppState & Action<AppActionsType>

export type AppReducer = ReducerApplied<AppState, AppAction>
