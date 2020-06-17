import {combineReducers} from 'redux'

import {appReducer} from '~src/store/reducers/app'
import {themeReducer} from '~src/store/reducers/theme'

export const rootReducer = combineReducers({
  app: appReducer,
  themeReducer,
})

export type RootState = ReturnType<typeof rootReducer>
