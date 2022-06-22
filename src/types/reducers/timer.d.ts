import { ReducerApplied } from '@simpli/redux-wrapper'
import { Action } from 'redux'
export declare global {
  type TimerActionsType = 'SET_TIMER_STATUS'

  interface TimerState {
    status: boolean
  }

  type TimerAction = TimerState & Action<TimerActionsType>

  type TimerReducer = ReducerApplied<TimerState, TimerAction>
}
