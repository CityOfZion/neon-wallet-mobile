import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class TipDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_TIP'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const {tip} = action

    return this.set(state, {tip})
  }
}
