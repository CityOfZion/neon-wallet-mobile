import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'

export type LoadingActionsType = 'SET_LOADING' | 'SET_LOADING_PROGRESS' | 'CLEAR_LOADING'

export interface LoadingState {
  progress: number
  loadingText: string
  isLoading: boolean
}

export type LoadingAction = LoadingState & Action<LoadingActionsType>

export type LoadingReducer = ReducerApplied<LoadingState, LoadingAction>
