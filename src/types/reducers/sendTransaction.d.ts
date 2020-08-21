import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {Account} from '~src/models/redux/Account'
import {TokenAsset} from '~src/models/TokenAsset'
import {PriorityFee} from "~src/models/PriorityFee";

export declare global {
  type SenderTransactionActionsType =
    | 'SET_ACCOUNT'
    | 'SET_TOKEN'
    | 'SET_RECEIVER_ADDRESS'
    | 'SET_FEE_AMOUNT'
    | 'CLEAR_STATE'

  interface SenderTransactionState {
    account: Account | null
    token: TokenAsset | null
    receiverAddress: string | null
    feeAmount: PriorityFee | null
  }

  type SenderTransactionAction = SenderTransactionState &
    Action<SenderTransactionActionsType>

  type SenderTransactionReducer = ReducerApplied<
    SenderTransactionState,
    SenderTransactionAction
  >
}
