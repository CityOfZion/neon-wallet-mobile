import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {localeConfig} from '~/src/config/LocaleConfig'
import {Setup} from '~src/app/Setup'

export class LanguageDispatcher extends DispatcherWrapper<
  SettingsActionsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_LANGUAGE'

  readonly reducer: SettingsReducer = (state, action) => {
    const {language} = action

    const keys = Object.keys(localeConfig.translations)

    if (keys.includes(language)) {
      Setup.changeLocale(language)
      return this.set(state, {language})
    }

    return state
  }
}
