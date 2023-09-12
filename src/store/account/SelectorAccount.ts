import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'
import { Account } from './Account'

const rootState = (state: RootState) => state

export const selectAccounts = createSelector(rootState, state =>
  state.account.data.map(account => new Account(account))
)
