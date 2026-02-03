import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { createMigrate, persistReducer } from 'redux-persist'

import { getWalletsMigrations } from './migrations'
import { walletSliceReducers } from './reducers'

import type { IWalletState } from '@/types/store'

export interface IWalletReducer {
  data: IWalletState[]
}

export let walletReducerActions: CaseReducerActions<typeof walletSliceReducers, string>

export function getWalletReducer() {
  const walletsMigrations = getWalletsMigrations()

  const walletReducerInitialState = {
    data: [],
  } as IWalletReducer

  const walletReducerConfig: PersistConfig<IWalletReducer> = {
    key: 'walletReducer',
    storage,
    timeout: 0,
    migrate: createMigrate(walletsMigrations),
    version: 3,
  }

  const walletSlice = createSlice({
    name: walletReducerConfig.key,
    initialState: walletReducerInitialState,
    reducers: walletSliceReducers,
  })

  walletReducerActions = walletSlice.actions

  return persistReducer(walletReducerConfig, walletSlice.reducer)
}
