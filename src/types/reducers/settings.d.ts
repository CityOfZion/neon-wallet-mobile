import {Action} from 'redux'
import {Lang} from '~src/enums/Lang'
import {Currency} from '~src/enums/Currency'
import {Theme} from '~src/enums/Theme'
import {ReducerApplied} from '@simpli/redux-wrapper'

export declare global {
  type SettingsType = 'SET_LANGUAGE' | 'SET_CURRENCY' | 'SET_THEME'

  interface SettingsState {
    language: Lang
    currency: Currency
    theme: Theme
  }

  type SettingsAction = SettingsState & Action<SettingsType>

  type SettingsReducer = ReducerApplied<SettingsState, SettingsAction>
}
