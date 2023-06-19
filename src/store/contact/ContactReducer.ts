import { CaseReducer, PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { Storage } from '~/src/app/Storage'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { ContactState } from '~/src/types/reducers/contact'

interface IContactReducer {
  data: ContactState[]
}

export const contactReducerName = 'contactReducer'

const initialState = {
  data: [],
} as IContactReducer

const migrateContactsFromStorage = createAsyncThunk('contacts/migrateContactFromStorage', async () => {
  return Storage.contacts.load()
})

const saveContact: CaseReducer<IContactReducer, PayloadAction<ContactState>> = (state, action) => {
  const contactState = action.payload
  contactState.id = contactState.id === null ? UtilsHelper.uuid() : contactState.id
  if (!('data' in state)) {
    state.data = [contactState]
  } else {
    const findIndex = state.data.findIndex(it => it.id === contactState.id)
    if (findIndex < 0) {
      state.data = [...state.data, contactState]
    } else {
      state.data[findIndex] = contactState
    }
  }
}

const deleteContact: CaseReducer<IContactReducer, PayloadAction<string>> = (state, action) => {
  if ('data' in state) {
    const idContact = action.payload
    state.data = state.data.filter(contact => contact.id !== idContact)
  }
}

const ContactReducer = createSlice({
  name: contactReducerName,
  initialState,
  reducers: {
    saveContact,
    deleteContact,
  },
  extraReducers(builder) {
    builder.addCase(migrateContactsFromStorage.fulfilled, (state, action) => {
      const contacts = action.payload?.map(it => {
        it.adaptNewFormat()
        return it.deserialize()
      })
      if (contacts) {
        if ('data' in state) {
          const appContacts = [...state.data, ...contacts]
          const notRepeatedContacts = new Set<string | null>()
          state.data = appContacts.filter(contact => {
            const isRepeated = notRepeatedContacts.has(contact.id)
            notRepeatedContacts.add(contact.id)
            if (!isRepeated) {
              return true
            } else {
              return false
            }
          })
        } else {
          state.data = contacts
        }
        Storage.contacts.erase()
      }
    })
  },
})

export const contactReducerActions = {
  ...ContactReducer.actions,
  migrateContactsFromStorage,
}
export default ContactReducer.reducer
