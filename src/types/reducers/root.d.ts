import {RootState as RState} from '~src/store/RootStore'
import {ThunkAction} from 'redux-thunk'
import {Action, AnyAction} from 'redux'

export declare global {
  type RootState = RState

  type AsyncAction<
    Return = void,
    A extends Action = any,
    E = any
  > = ThunkAction<Promise<Return>, RootState, E, A>

  type SyncDispatch<A extends Action = AnyAction> = (action: Partial<A>) => void

  type AsyncDispatch<Return = void, A extends Action = AnyAction, E = any> = (
    action: AsyncAction<Return, A, E>
  ) => Promise<Return>
}
