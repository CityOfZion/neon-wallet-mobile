import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'

import { contactSliceReducers } from './reducers'

import type { TContact } from '@/types/store'

export type TContactReducer = {
  data: TContact[]
}

export let contactReducerActions: CaseReducerActions<typeof contactSliceReducers, string>

export function getContactReducer() {
  const contactReducerInitialState: TContactReducer = {
    data: [],
  }

  const contactReducerConfig: PersistConfig<TContactReducer> = { key: 'contactReducer', storage, timeout: 0 }

  const contactSlice = createSlice({
    name: contactReducerConfig.key,
    initialState: contactReducerInitialState,
    reducers: contactSliceReducers,
  })

  contactReducerActions = contactSlice.actions

  return persistReducer(contactReducerConfig, contactSlice.reducer)
}
