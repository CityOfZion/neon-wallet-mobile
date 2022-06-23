import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class NameDispatcher extends DispatcherWrapper<AccountActionsType, AccountState, AccountAction> {
  readonly type = 'SET_NAME_ACCOUNT'

  readonly reducer: AccountReducer = (state, action) => {
    const { name } = action

    return this.set(state, { name })
  }
}
