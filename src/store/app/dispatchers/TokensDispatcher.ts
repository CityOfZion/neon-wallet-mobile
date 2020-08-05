import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class TokensDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_TOKENS'

  readonly reducer: AppReducer = (state, action) => {
    const {tokens} = action

    return this.set(state, {tokens})
  }
}
