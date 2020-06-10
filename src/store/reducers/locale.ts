import i18n from '~src/i18n'
import {ISetLocaleAction, SET_LOCALE} from '~src/store/actions/locale'

interface ILocaleState {
  locale: string
}

const localeState: ILocaleState = {
  locale: 'en',
}

export const localeReducer = (
  state: ILocaleState = localeState,
  action: ISetLocaleAction
) => {
  switch (action.type) {
    case SET_LOCALE:
      if (Object.keys(i18n.translations).includes(action.locale)) {
        i18n.locale = action.locale
        return {...state, locale: i18n.currentLocale()}
      } else {
        return state
      }
    default:
      return state
  }
}
