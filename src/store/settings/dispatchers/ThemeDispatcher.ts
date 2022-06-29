import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { SettingsActionsType, SettingsState, SettingsAction, SettingsReducer } from '~/src/types/reducers/settings'

export class ThemeDispatcher extends DispatcherWrapper<SettingsActionsType, SettingsState, SettingsAction> {
  readonly type = 'SET_THEME'

  readonly reducer: SettingsReducer = (state, action) => {
    const { theme } = action

    return this.set(state, { theme })
  }
}
