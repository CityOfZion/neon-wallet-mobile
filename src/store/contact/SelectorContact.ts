import { createSelector } from '@reduxjs/toolkit'
import { plainToClass } from 'class-transformer'

import { RootState } from '../RootStore'

import { Contact } from '~/src/models/redux/Contact'

const rootState = (state: RootState) => state

export const selectContacts = createSelector(rootState, state => plainToClass(Contact, state.contact.data))
