import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type LoadingType = 'SET_LOADING' | 'SET_LOADING_PROGRESS' | 'CLEAR_LOADING'

  interface LoadingState {
    progress: number
    loadingText: string
    isLoading: boolean
  }

  type LoadingAction = LoadingState & Action<LoadingType>

  type LoadingReducer = ReducerApplied<LoadingState, LoadingAction>
}
