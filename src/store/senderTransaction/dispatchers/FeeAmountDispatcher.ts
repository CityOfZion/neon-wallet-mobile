import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class FeeAmountDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_FEE_AMOUNT'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const {feeAmount} = action

    return this.set(state, {feeAmount})
  }
}
