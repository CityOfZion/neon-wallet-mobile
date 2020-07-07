import {$} from '~/facade'
import {ISetThemeAction, SET_THEME} from '~src/store/actions/theme'

interface IThemeState {
  theme: DefaultTheme
}

const themeState: IThemeState = {
  theme: {...$.themeDark},
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
