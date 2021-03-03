import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class AccountPreCreatedDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_PRE_ACCOUNT_CREATE'

  readonly reducer: AppReducer = (state, action) => {
    const {preAccount} = action

    return this.set(state, {preAccount})
  }
}
