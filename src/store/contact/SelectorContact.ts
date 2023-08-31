import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'
import { Contact } from './Contact'

const rootState = (state: RootState) => state

export const selectContacts = createSelector(rootState, state =>
  state.contact.data.map(contact => new Contact(contact))
)
export const selectContactById = (id: string | null) =>
  createSelector(rootState, state => {
    const contact = state.contact.data.find(contact => contact.id === id)
    return contact ? new Contact(contact) : undefined
  })
