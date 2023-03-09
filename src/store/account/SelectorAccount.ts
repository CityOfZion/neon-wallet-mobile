import { createSelector } from '@reduxjs/toolkit'
import { plainToClass } from 'class-transformer'

import { RootState } from '../RootStore'

import { Account } from '~/src/models/redux/Account'

const rootState = (state: RootState) => state

export const selectAccounts = createSelector(rootState, state => plainToClass(Account, state.account.data))
