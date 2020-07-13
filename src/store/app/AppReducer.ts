import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Theme} from '~src/enums/Theme'
import {CurrencyDispatcher} from '~src/store/app/dispatchers/CurrencyDispatcher'
import {LanguageDispatcher} from '~src/store/app/dispatchers/LanguageDispatcher'
import {ThemeDispatcher} from '~src/store/app/dispatchers/ThemeDispatcher'

export class AppReducer extends ReducerWrapper<AppType, AppState, AppAction> {
  protected readonly initialState: AppState = {
    language: Facade.config.locale.defaultLanguage,
    currency: Facade.config.locale.defaultCurrency,
    theme: Facade.config.application.defaultTheme,
  }

  protected readonly dispatchers = [
    LanguageDispatcher,
    CurrencyDispatcher,
    ThemeDispatcher,
  ]

  readonly actions = {
    setLanguage: (language: Lang) => {
      return this.commit('SET_LANGUAGE', {language})
    },

    setCurrency: (currency: Currency) => {
      return this.commit('SET_CURRENCY', {currency})
    },

    setTheme: (theme: Theme) => {
      return this.commit('SET_THEME', {theme})
    },
  }
}
