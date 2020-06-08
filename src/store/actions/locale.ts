export const SET_LOCALE = 'SET_LOCALE'

export interface IAction {
  type: string
}

export interface ISetLocaleAction extends IAction {
  locale: string
}

export const setLocale = (val: string) => {
  return {type: SET_LOCALE, locale: val}
}
