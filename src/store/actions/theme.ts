import DefaultTheme from '~src/styles/styled'

export const SET_THEME = 'SET_THEME'

export interface IAction {
  type: string
}

export interface ISetThemeAction extends IAction {
  theme: DefaultTheme
}

export const setTheme = (val: DefaultTheme) => {
  return {type: SET_THEME, theme: val}
}
