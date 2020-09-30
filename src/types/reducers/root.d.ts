import {RootState as RState} from '~src/store/RootStore'
import {ThunkAction} from 'redux-thunk'
import {Action, AnyAction} from 'redux'

export declare global {
  type RootState = RState

  type SyncAction<Return = void, A extends Action = any, E = any> = ThunkAction<
    Return,
    RootState,
    E,
    A
  >

  type AsyncAction<
    Return = void,
    A extends Action = any,
    E = any
  > = ThunkAction<Promise<Return>, RootState, E, A>

  type DispatchResult<A extends Action = AnyAction> = (
    action: Partial<A>
  ) => void

  type SyncDispatch<Return = void, A extends Action = AnyAction, E = any> = (
    action: SyncAction<Return, A, E>
  ) => Return

  type AsyncDispatch<Return = void, A extends Action = AnyAction, E = any> = (
    action: AsyncAction<Return, A, E>
  ) => Promise<Return>
}
