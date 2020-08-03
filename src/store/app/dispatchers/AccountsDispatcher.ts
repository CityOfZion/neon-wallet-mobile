import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class AccountsDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_ACCOUNTS'

  readonly reducer: AppReducer = (state, action) => {
    const {accounts} = action

    return this.set(state, {accounts})
  }
}
