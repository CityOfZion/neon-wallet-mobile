import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { LoadingAction, LoadingActionsType, LoadingReducer, LoadingState } from '~/src/types/reducers/loading'

export class LoadingProgressDispatcher extends DispatcherWrapper<LoadingActionsType, LoadingState, LoadingAction> {
  readonly type = 'SET_LOADING_PROGRESS'

  readonly reducer: LoadingReducer = (state, action) => {
    const { progress } = action

    return this.set(state, { progress })
  }
}
