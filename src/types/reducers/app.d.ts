import {Action} from 'redux'
import {Lang} from '~src/enums/Lang'
import {Currency} from '~src/enums/Currency'
import {Theme} from '~src/enums/Theme'

export declare global {
  type AppType = 'SET_LANGUAGE' | 'SET_CURRENCY' | 'SET_THEME'

  interface AppState {
    language: Lang
    currency: Currency
    theme: Theme
  }

  type AppAction = AppState & Action<AppType>

  type AppReducer = ReducerApplied<AppState, AppAction>
}
