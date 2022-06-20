import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SettingsActionsType,
  SettingsState,
  SettingsAction,
  SettingsReducer,
} from '~/src/types/reducers/settings'

export class IsFirstTimeDispatcher extends DispatcherWrapper<
  SettingsActionsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_IS_FIRST_TIME'

  readonly reducer: SettingsReducer = (state, action) => {
    const { isFirstTime } = action
    return this.set(state, { isFirstTime })
  }
}
