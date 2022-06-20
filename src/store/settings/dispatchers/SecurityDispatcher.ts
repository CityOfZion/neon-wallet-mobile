import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SettingsActionsType,
  SettingsState,
  SettingsAction,
  SettingsReducer,
} from '~/src/types/reducers/settings'

export class SecurityDispatcher extends DispatcherWrapper<
  SettingsActionsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_SECURITY'

  readonly reducer: SettingsReducer = (state, action) => {
    const { security } = action
    return this.set(state, { security })
  }
}
