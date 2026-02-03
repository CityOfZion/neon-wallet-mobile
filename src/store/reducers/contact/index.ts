import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer } from 'redux-persist'

import { contactSliceReducers } from './reducers'

import type { IContactState } from '@/types/store'

export interface IContactReducer {
  data: IContactState[]
}

export let contactReducerActions: CaseReducerActions<typeof contactSliceReducers, string>

export function getContactReducer() {
  const contactReducerInitialState = {
    data: [],
  } as IContactReducer

  const contactReducerConfig: PersistConfig<IContactReducer> = { key: 'contactReducer', storage, timeout: 0 }

  const contactSlice = createSlice({
    name: contactReducerConfig.key,
    initialState: contactReducerInitialState,
    reducers: contactSliceReducers,
  })

  contactReducerActions = contactSlice.actions

  const persistedAccountReducer = persistReducer(contactReducerConfig, contactSlice.reducer)

  return persistedAccountReducer
}
