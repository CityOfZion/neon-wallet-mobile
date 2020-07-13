import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {Facade} from '~src/app/Facade'
import {Setup} from '~src/app/Setup'

export class LanguageDispatcher extends DispatcherWrapper<
  AppType,
  AppState,
  AppAction
> {
  readonly type = 'SET_LANGUAGE'

  readonly reducer: AppReducer = (state, action) => {
    const {language} = action

    const keys = Object.keys(Facade.config.locale.translations)

    if (keys.includes(language)) {
      Setup.changeLocale(language)
      return this.set(state, {language})
    }

    return state
  }
}
