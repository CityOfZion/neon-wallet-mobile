import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import type { IContactReducer } from './index'

import type { IContactState } from '@/types/store'

const saveContact: CaseReducer<IContactReducer, PayloadAction<IContactState>> = (state, action) => {
  const contact = action.payload

  const findIndex = state.data.findIndex(it => it.id === contact.id)
  if (findIndex < 0) {
    state.data = [...state.data, contact]
    return
  }

  state.data[findIndex] = contact
}

const deleteContact: CaseReducer<IContactReducer, PayloadAction<string>> = (state, action) => {
  const idContact = action.payload
  state.data = state.data.filter(contact => contact.id !== idContact)
}

export const contactSliceReducers = {
  deleteContact,
  saveContact,
}
