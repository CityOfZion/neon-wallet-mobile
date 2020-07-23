import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class ThemeDispatcher extends DispatcherWrapper<
  SettingsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_THEME'

  readonly reducer: SettingsReducer = (state, action) => {
    const {theme} = action

    return this.set(state, {theme})
  }
}
