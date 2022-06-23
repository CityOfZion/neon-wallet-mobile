import {ReducerApplied} from '@simpli/redux-wrapper'
import {Action} from 'redux'

export type TimerActionsType = 'SET_TIMER_STATUS'

export interface TimerState {
  status: boolean
}

export type TimerAction = TimerState & Action<TimerActionsType>

export type TimerReducer = ReducerApplied<TimerState, TimerAction>
