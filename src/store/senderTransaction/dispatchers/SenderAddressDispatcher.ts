import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class SenderAddressDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_SENDER_ADDRESS'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const { senderAddress } = action

    return this.set(state, { senderAddress })
  }
}
