import { Action } from 'redux'
import { Lang } from '~src/enums/Lang'
import { Currency } from '~src/enums/Currency'
import { Theme } from '~src/enums/Theme'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { Security } from '~/src/enums/Security'

export type SettingsActionsType =
  | 'SET_LANGUAGE'
  | 'SET_CURRENCY'
  | 'SET_THEME'
  | 'SET_SECURITY'
  | 'SET_IS_FIRST_TIME'

export interface SettingsState {
  language: Lang
  currency: Currency
  theme: Theme
  security: Security
  isFirstTime: boolean
}

export type SettingsAction = SettingsState & Action<SettingsActionsType>

export type SettingsReducer = ReducerApplied<SettingsState, SettingsAction>
