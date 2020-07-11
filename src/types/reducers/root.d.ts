import {Action, AnyAction} from 'redux'
import {RootState as RState} from '~src/store/RootStore'

export declare global {
  type RootState = RState

  export type ReducerApplied<S = any, A extends Action = AnyAction> = (
    state: S,
    action: A
  ) => S
}
