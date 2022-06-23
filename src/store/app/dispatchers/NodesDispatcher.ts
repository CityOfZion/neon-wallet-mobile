import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class NodesDispatcher extends DispatcherWrapper<AppActionsType, AppState, AppAction> {
  readonly type = 'SET_NODES'

  readonly reducer: AppReducer = (state, action) => {
    const { nodes } = action

    return this.set(state, { nodes })
  }
}
