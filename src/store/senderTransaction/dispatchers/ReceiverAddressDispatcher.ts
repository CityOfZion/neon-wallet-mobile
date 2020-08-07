import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class ReceiverAddressDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_RECEIVER_ADDRESS'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const {receiverAddress} = action

    return this.set(state, {receiverAddress})
  }
}
