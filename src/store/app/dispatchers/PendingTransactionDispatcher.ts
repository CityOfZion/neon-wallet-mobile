import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class PendingTransactionDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_PENDING_TRANSACTIONS'

  readonly reducer: AppReducer = (state, action) => {
    const {pendingTransactions} = action

    return this.set(state, {pendingTransactions})
  }
}
