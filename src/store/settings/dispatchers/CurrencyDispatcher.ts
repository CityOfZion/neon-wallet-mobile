import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SettingsActionsType,
  SettingsState,
  SettingsAction,
  SettingsReducer,
} from '~/src/types/reducers/settings'

export class CurrencyDispatcher extends DispatcherWrapper<
  SettingsActionsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_CURRENCY'

  readonly reducer: SettingsReducer = (state, action) => {
    const { currency } = action

    return this.set(state, { currency })
  }
}
