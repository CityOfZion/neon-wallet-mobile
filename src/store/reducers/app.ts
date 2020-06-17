import {DEFAULT_CURRENCY} from '~/constants'
import i18n from '~src/i18n'
import {IAppAction, SET_CURRENCY, SET_LOCALE} from '~src/store/actions/app'

interface IAppState {
  locale: string
  currency: string
}

const appState: IAppState = {
  locale: 'en',
  currency: DEFAULT_CURRENCY,
}

export const appReducer = (state: IAppState = appState, action: IAppAction) => {
  switch (action.type) {
    case SET_LOCALE:
      if (Object.keys(i18n.translations).includes(action.locale)) {
        i18n.locale = action.locale
        return {...state, locale: i18n.currentLocale()}
      } else {
        return state
      }
    case SET_CURRENCY:
      return {...state, currency: action.currency}
    default:
      return state
  }
}
