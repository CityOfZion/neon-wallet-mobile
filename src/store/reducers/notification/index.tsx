import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { createMigrate, persistReducer } from 'redux-persist'

import { getNotificationMigrations } from './migrations'
import { notificationSliceReducers } from './reducers'

import type { TNotification } from '@/types/store'

export interface INotificationReducer {
  data: TNotification[]
}

export let notificationReducerActions: CaseReducerActions<typeof notificationSliceReducers, string>

export function getNotificationReducer() {
  const notificationMigrations = getNotificationMigrations()

  const notificationReducerInitialState: INotificationReducer = {
    data: [],
  }

  const notificationReducerConfig: PersistConfig<INotificationReducer> = {
    key: 'notificationReducer',
    storage,
    timeout: 0,
    migrate: createMigrate(notificationMigrations),
    version: 2,
  }

  const notificationSlice = createSlice({
    name: notificationReducerConfig.key,
    initialState: notificationReducerInitialState,
    reducers: notificationSliceReducers,
  })

  notificationReducerActions = notificationSlice.actions

  return persistReducer(notificationReducerConfig, notificationSlice.reducer)
}
