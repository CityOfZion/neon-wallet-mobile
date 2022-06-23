import {RootState} from '~src/store/RootStore'
import {ThunkAction} from 'redux-thunk'
import {Action, AnyAction} from 'redux'

export type SyncAction<
  Return = void,
  A extends Action = any,
  E = any
> = ThunkAction<Return, RootState, E, A>

export type AsyncAction<
  Return = void,
  A extends Action = any,
  E = any
> = ThunkAction<Promise<Return>, RootState, E, A>

export type DispatchResult<A extends Action = AnyAction> = (
  action: Partial<A>
) => void

export type SyncDispatch<
  Return = void,
  A extends Action = AnyAction,
  E = any
> = (action: SyncAction<Return, A, E>) => Return

export type AsyncDispatch<
  Return = void,
  A extends Action = AnyAction,
  E = any
> = (action: AsyncAction<Return, A, E>) => Promise<Return>
