import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class WalletsDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_WALLETS'

  readonly reducer: AppReducer = (state, action) => {
    const {wallets} = action

    return this.set(state, {wallets})
  }
}
