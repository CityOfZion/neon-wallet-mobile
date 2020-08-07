import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class TokenDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_TOKEN'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const {token} = action

    return this.set(state, {token})
  }
}
