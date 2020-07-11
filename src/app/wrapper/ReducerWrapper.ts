import {ClassType} from 'class-transformer/ClassTransformer'
import {Action} from 'redux'

import {DispatcherWrapper} from '~src/app/wrapper/DispatcherWrapper'

export abstract class ReducerWrapper<
  T extends string,
  S,
  A extends S & Action<T>
> {
  protected abstract readonly initialState: S
  protected abstract readonly dispatchers: ClassType<
    DispatcherWrapper<T, S, A>
  >[]

  abstract readonly actions: Dictionary<(payload: any) => Partial<A>>

  readonly reducer = (state = this.initialState, action: A): S => {
    const instance = this.dispatchers.map(
      (Dispatcher) => new Dispatcher(this.initialState)
    )
    const dispatcher = instance.find((it) => it.type === action.type)

    if (dispatcher) {
      return dispatcher.reducer(state, action)
    }

    return state
  }

  protected commit(type: T, payload: Partial<Omit<A, 'type'>>): Partial<A> {
    return {type, ...payload}
  }
}
