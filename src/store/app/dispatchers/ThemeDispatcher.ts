import {DispatcherWrapper} from '~src/app/wrapper/DispatcherWrapper'

export class ThemeDispatcher extends DispatcherWrapper<
  AppType,
  AppState,
  AppAction
> {
  readonly type = 'SET_THEME'

  readonly reducer: AppReducer = (state, action) => {
    const {theme} = action

    return this.set(state, {theme})
  }
}
