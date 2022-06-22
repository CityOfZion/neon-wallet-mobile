import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class LoadingDispatcher extends DispatcherWrapper<LoadingActionsType, LoadingState, LoadingAction> {
  readonly type = 'SET_LOADING'

  readonly reducer: LoadingReducer = (state, action) => {
    const { loadingText } = action

    return this.set(state, { isLoading: true, loadingText })
  }
}
