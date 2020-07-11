import {combineReducers} from 'redux'

import loading from './loading'

import {appReducer} from '~src/store/reducers/app'
import {themeReducer} from '~src/store/reducers/theme'

export const rootReducer = combineReducers({
  app: appReducer,
  themeReducer,
  loading,
})

export type RootState = ReturnType<typeof rootReducer>
