import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { TokenAsset } from '~src/models/TokenAsset'
import { SenderTransactionInfo } from '~/src/blockchain'

export declare global {
  type SenderTransactionActionsType =
    | 'SET_TOKEN'
    | 'SET_SENDER_ADDRESS'
    | 'SET_RECEIVER_ADDRESS'
    | 'SET_FEE_AMOUNT'
    | 'CLEAR_STATE_SENDER_TRANSACTION'
    | 'SET_FIAT'
    | 'SET_TIP'

  interface SenderTransactionState extends SenderTransactionInfo {
    fiat?: number | null
    tokens: TokenAsset[]
  }

  type SenderTransactionAction = SenderTransactionState & Action<SenderTransactionActionsType>

  type SenderTransactionReducer = ReducerApplied<SenderTransactionState, SenderTransactionAction>
}
