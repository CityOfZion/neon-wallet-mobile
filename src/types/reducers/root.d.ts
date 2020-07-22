import {RootState as RState} from '~src/store/RootStore'
import {ThunkAction} from 'redux-thunk'

export declare global {
  type RootState = RState
  type AsyncAction<Return = void> = ThunkAction<
    Promise<Return>,
    RootState,
    any,
    any
  >
}
