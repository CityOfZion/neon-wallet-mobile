import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class LoadingProgressDispatcher extends DispatcherWrapper<
  LoadingType,
  LoadingState,
  LoadingAction
> {
  readonly type = 'SET_LOADING_PROGRESS'

  readonly reducer: LoadingReducer = (state, action) => {
    const {progress} = action

    return this.set(state, {progress})
  }
}
