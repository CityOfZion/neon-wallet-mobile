import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class AccountDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_ACCOUNT'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const {account} = action

    return this.set(state, {account})
  }
}
