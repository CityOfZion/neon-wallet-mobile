import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { createMigrate, persistReducer } from 'redux-persist'

import { getAccountsMigrations } from './migrations'
import { accountSliceReducers } from './reducers'

import type { IAccountState } from '@/types/store'

export interface IAccountReducer {
  data: IAccountState[]
}

export let accountReducerActions: CaseReducerActions<typeof accountSliceReducers, string>

export function getAccountReducer() {
  const accountsMigrations = getAccountsMigrations()

  const accountReducerInitialState: IAccountReducer = {
    data: [],
  }

  const accountReducerConfig: PersistConfig<IAccountReducer> = {
    key: 'accountReducer',
    storage,
    timeout: 0,
    migrate: createMigrate(accountsMigrations),
    version: 3,
  }

  const accountSlice = createSlice({
    name: accountReducerConfig.key,
    initialState: accountReducerInitialState,
    reducers: accountSliceReducers,
  })

  accountReducerActions = accountSlice.actions

  return persistReducer(accountReducerConfig, accountSlice.reducer)
}
