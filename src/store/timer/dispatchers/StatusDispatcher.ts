import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class StatusDispatcher extends DispatcherWrapper<
  TimerActionsType,
  TimerState,
  TimerAction
> {
  readonly type = 'SET_TIMER_STATUS'
  readonly reducer: TimerReducer = (state, action) => {
    const {status} = action
    return this.set(state, {status})
  }
}
