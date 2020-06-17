export const SET_LOCALE = 'SET_LOCALE'
export const SET_CURRENCY = 'SET_CURRENCY'

export interface IAction {
  type: string
}

export interface IAppAction extends IAction {
  locale: string
  currency: string
}

export const setLocale = (val: string) => {
  return {type: SET_LOCALE, locale: val}
}

export const setCurrency = (val: string) => {
  return {type: SET_CURRENCY, currency: val}
}
