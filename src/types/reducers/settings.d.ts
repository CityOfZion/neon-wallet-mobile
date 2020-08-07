import {Action} from 'redux'
import {Lang} from '~src/enums/Lang'
import {Currency} from '~src/enums/Currency'
import {Theme} from '~src/enums/Theme'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {NetworkOptions} from '~src/types/settings'

export declare global {
  type SettingsActionsType =
    | 'SET_LANGUAGE'
    | 'SET_CURRENCY'
    | 'SET_THEME'
    | 'SET_NETWORK'

  interface SettingsState {
    language: Lang
    currency: Currency
    theme: Theme
    network: NetworkOptions
  }

  type SettingsAction = SettingsState & Action<SettingsActionsType>

  type SettingsReducer = ReducerApplied<SettingsState, SettingsAction>
}
