import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Theme} from '~src/enums/Theme'
import {Settings} from '~src/models/redux/Settings'
import {RootStore} from '~src/store/RootStore'
import {CurrencyDispatcher} from '~src/store/settings/dispatchers/CurrencyDispatcher'
import {LanguageDispatcher} from '~src/store/settings/dispatchers/LanguageDispatcher'
import {ThemeDispatcher} from '~src/store/settings/dispatchers/ThemeDispatcher'

export class SettingsReducer extends ReducerWrapper<
  SettingsType,
  SettingsState,
  SettingsAction
> {
  protected readonly initialState = Model.parse<SettingsState>(Settings)

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

    syncSettings: (): AsyncAction<Settings> => {
      return async (dispatch, getState) => {
        const settings = await Storage.settings.load()

        if (settings) {
          const {language, currency, theme} = settings

          dispatch(this.commit('SET_LANGUAGE', {language}))
          dispatch(this.commit('SET_CURRENCY', {currency}))
          dispatch(this.commit('SET_THEME', {theme}))
        }

        return settings ?? new Settings()
      }
    },

    save: (): AsyncAction => {
      return async (dispatch, getState) => {
        const state = getState().settings
        await Storage.settings.save(state)
      }
    },
  }
}
