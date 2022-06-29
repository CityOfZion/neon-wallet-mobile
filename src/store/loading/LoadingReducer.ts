import { ReducerWrapper } from '@simpli/redux-wrapper'

import { LoadingAction, LoadingActionsType, LoadingState } from '~/src/types/reducers/loading'
import { ClearLoadingDispatcher } from '~src/store/loading/dispatchers/ClearLoadingDispatcher'
import { LoadingDispatcher } from '~src/store/loading/dispatchers/LoadingDispatcher'
import { LoadingProgressDispatcher } from '~src/store/loading/dispatchers/LoadingProgressDispatcher'

export class LoadingReducer extends ReducerWrapper<LoadingActionsType, LoadingState, LoadingAction> {
  protected readonly initialState: LoadingState = {
    progress: 0,
    loadingText: '',
    isLoading: false,
  }

  protected readonly dispatchers = [LoadingDispatcher, LoadingProgressDispatcher, ClearLoadingDispatcher]

  readonly actions = {
    setLoading: (isLoading: boolean, loadingText: string) => {
      return this.commit('SET_LOADING', { isLoading, loadingText })
    },

    setLoadingProgress: (progress: number) => {
      return this.commit('SET_LOADING_PROGRESS', { progress })
    },

    clearLoading: () => {
      return this.commit('CLEAR_LOADING', {})
    },
  }
}
