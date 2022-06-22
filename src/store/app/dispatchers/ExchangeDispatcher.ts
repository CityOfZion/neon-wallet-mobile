import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class ExchangeDispatcher extends DispatcherWrapper<AppActionsType, AppState, AppAction> {
  readonly type = 'SET_EXCHANGE'

  readonly reducer: AppReducer = (state, action) => {
    const { exchange } = action

    return this.set(state, { exchange })
  }
}
