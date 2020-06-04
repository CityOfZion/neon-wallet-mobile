import {combineReducers} from 'redux'

import {localeReducer} from './locale'

export const rootReducer = combineReducers({locale: localeReducer})
