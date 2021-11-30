import {ReducerWrapper} from '@simpli/redux-wrapper'

import {StatusDispatcher} from './dispatchers/StatusDispatcher'

import {Model} from '~/src/app/Model'

export class TimerReducer extends ReducerWrapper<
  TimerActionsType,
  TimerState,
  TimerAction
> {
  protected readonly initialState = Model.parse<TimerState>({status: true})

  protected readonly dispatchers = [StatusDispatcher]

  readonly actions = {
    setTimerOn: () => {
      return this.commit('SET_TIMER_STATUS', {status: true})
    },
    setTimerOff: () => {
      return this.commit('SET_TIMER_STATUS', {status: false})
    },
  }
}
