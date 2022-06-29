import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { LoadingAction, LoadingActionsType, LoadingReducer, LoadingState } from '~/src/types/reducers/loading'

export class LoadingDispatcher extends DispatcherWrapper<LoadingActionsType, LoadingState, LoadingAction> {
  readonly type = 'SET_LOADING'

  readonly reducer: LoadingReducer = (state, action) => {
    const { loadingText } = action

    return this.set(state, { isLoading: true, loadingText })
  }
}
