import {Action} from 'redux'

export abstract class DispatcherWrapper<
  T extends string,
  S,
  A extends S & Action<T>
> {
  abstract readonly type: T

  protected readonly initialState: S

  constructor(initialState: S) {
    this.initialState = initialState
  }

  readonly reducer: ReducerApplied<S, A> = (
    state = this.initialState,
    action
  ) => {
    return this.reducer(state, action)
  }

  set(state: S, payload: Partial<A>): S {
    const newState = {...payload}
    delete newState.type

    return {...state, ...newState}
  }
}
