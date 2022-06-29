import { ReducerWrapper } from '@simpli/redux-wrapper'

import { Security } from '~/src/enums/Security'
import { AsyncAction } from '~/src/types/reducers/root'
import { SettingsActionsType, SettingsState, SettingsAction } from '~/src/types/reducers/settings'
import { Model } from '~src/app/Model'
import { Storage } from '~src/app/Storage'
import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'
import { Theme } from '~src/enums/Theme'
import { Settings } from '~src/models/redux/Settings'
import { CurrencyDispatcher } from '~src/store/settings/dispatchers/CurrencyDispatcher'
import { IsFirstTimeDispatcher } from '~src/store/settings/dispatchers/IsFirstTimeDispatcher'
import { LanguageDispatcher } from '~src/store/settings/dispatchers/LanguageDispatcher'
import { SecurityDispatcher } from '~src/store/settings/dispatchers/SecurityDispatcher'
import { ThemeDispatcher } from '~src/store/settings/dispatchers/ThemeDispatcher'
export class SettingsReducer extends ReducerWrapper<SettingsActionsType, SettingsState, SettingsAction> {
  protected readonly initialState = Model.parse<SettingsState>(Settings)

  protected readonly dispatchers = [
    LanguageDispatcher,
    CurrencyDispatcher,
    ThemeDispatcher,
    SecurityDispatcher,
    IsFirstTimeDispatcher,
  ]

  readonly actions = {
    setLanguage: (language: Lang) => {
      return this.commit('SET_LANGUAGE', { language })
    },

    setCurrency: (currency: Currency) => {
      return this.commit('SET_CURRENCY', { currency })
    },

    setSecurity: (security: Security) => {
      return this.commit('SET_SECURITY', { security })
    },

    setTheme: (theme: Theme) => {
      return this.commit('SET_THEME', { theme })
    },

    setIsFirstTime: (isFirstTime: boolean) => {
      return this.commit('SET_IS_FIRST_TIME', { isFirstTime })
    },

    syncSettings: (): AsyncAction<Settings> => {
      return async (dispatch, getState) => {
        const settings = await Storage.settings.load()

        if (settings) {
          const { language, currency, theme, security, isFirstTime } = settings

          dispatch(this.commit('SET_LANGUAGE', { language }))
          dispatch(this.commit('SET_CURRENCY', { currency }))
          dispatch(this.commit('SET_THEME', { theme }))
          dispatch(this.commit('SET_SECURITY', { security }))
          dispatch(this.commit('SET_IS_FIRST_TIME', { isFirstTime }))
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
