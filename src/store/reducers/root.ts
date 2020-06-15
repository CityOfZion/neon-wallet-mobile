import {combineReducers} from 'redux'

import {localeReducer} from '~src/store/reducers/locale'
import {themeReducer} from '~src/store/reducers/theme'

export const rootReducer = combineReducers({
  locale: localeReducer,
  themeReducer,
})

export type RootState = ReturnType<typeof rootReducer>
