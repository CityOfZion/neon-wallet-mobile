import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class ClearLoadingDispatcher extends DispatcherWrapper<
  LoadingType,
  LoadingState,
  LoadingAction
> {
  readonly type = 'CLEAR_LOADING'

  readonly reducer: LoadingReducer = (state, action) => {
    return this.set(state, {isLoading: false, progress: 0, loadingText: ''})
  }
}
