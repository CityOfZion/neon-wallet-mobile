import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {TokenAsset} from '~src/models/TokenAsset'
import {PriorityFee} from '~src/models/PriorityFee'

export declare global {
  type SenderTransactionActionsType =
    | 'SET_TOKEN'
    | 'SET_SENDER_ADDRESS'
    | 'SET_RECEIVER_ADDRESS'
    | 'SET_FEE_AMOUNT'
    | 'CLEAR_STATE_SENDER_TRANSACTION'
    | 'SET_FIAT'

  interface SenderTransactionState {
    token: TokenAsset | null
    senderAddress: string | null
    receiverAddress: string | null
    feeAmount: PriorityFee | null
    fiat?: number | null
  }

  type SenderTransactionAction = SenderTransactionState &
    Action<SenderTransactionActionsType>

  type SenderTransactionReducer = ReducerApplied<
    SenderTransactionState,
    SenderTransactionAction
  >
}
