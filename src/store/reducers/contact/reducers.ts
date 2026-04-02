import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import type { TContactReducer } from './index'

import type { TContact } from '@/types/store'

const saveContact: CaseReducer<TContactReducer, PayloadAction<TContact>> = (state, action) => {
  const contact = action.payload
  const foundIndex = state.data.findIndex(({ id }) => id === contact.id)

  if (foundIndex < 0) {
    state.data = [...state.data, contact]

    return
  }

  state.data[foundIndex] = contact
}

const deleteContact: CaseReducer<TContactReducer, PayloadAction<string>> = (state, action) => {
  const contactId = action.payload

  state.data = state.data.filter(contact => contact.id !== contactId)
}

export const contactSliceReducers = {
  deleteContact,
  saveContact,
}
