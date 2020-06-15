import {ISetThemeAction, SET_THEME} from '~src/store/actions/theme'
import {DefaultTheme} from '~src/styles/styled-components'
import darkTheme from '~src/styles/themes/dark'

interface IThemeState {
  theme: DefaultTheme
}

const themeState: IThemeState = {
  theme: {...darkTheme},
}

export const themeReducer = (
  state: IThemeState = themeState,
  action: ISetThemeAction
) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: {...state.theme, ...action.theme},
      }
    default:
      return state
  }
}
