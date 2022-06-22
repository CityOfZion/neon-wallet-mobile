import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class IndexDispatcher extends DispatcherWrapper<AccountActionsType, AccountState, AccountAction> {
  readonly type = 'SET_INDEX_ACCOUNT'

  readonly reducer: AccountReducer = (state, action) => {
    const { index } = action

    return this.set(state, { index })
  }
}
