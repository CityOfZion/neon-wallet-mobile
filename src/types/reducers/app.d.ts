import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { Wallet } from '~src/models/redux/Wallet'
import { Account } from '~src/models/redux/Account'
import { MultichainExchange } from '~src/types/exchange'
import { Contact } from '~src/models/redux/Contact'
import { TokenAsset } from '~src/models/TokenAsset'
import { Node } from '~src/models/Node'
export declare global {
  type AppActionsType =
    | 'SET_EXCHANGE'
    | 'SET_TOKENS'
    | 'SET_NODES'
    | 'SET_WALLETS'
    | 'SET_ACCOUNTS'
    | 'SET_CONTACTS'
    | 'SET_PENDING_TRANSACTIONS'
    | 'SET_PRE_ACCOUNT_CREATE'

  interface AppState {
    exchange: MultichainExchange
    tokens: TokenAsset[]
    nodes: Node[]
    wallets: Wallet[]
    accounts: Account[]
    contacts: Contact[]
  }

  type AppAction = AppState & Action<AppActionsType>

  type AppReducer = ReducerApplied<AppState, AppAction>
}
