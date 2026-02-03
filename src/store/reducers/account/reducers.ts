import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { AccountHelper } from '@/helpers/AccountHelper'
import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import type { IAccountReducer } from '.'

import type { IAccountState } from '@/types/store'

const saveAccount: CaseReducer<IAccountReducer, PayloadAction<IAccountState>> = (state, action) => {
  const account = ValidationSchemaHelper.parseAccount(action.payload)
  const findIndex = state.data.findIndex(account => account.id === action.payload.id)

  if (findIndex < 0) {
    state.data = [...state.data, account]
    return
  }

  state.data[findIndex] = account
}

const deleteAccount: CaseReducer<IAccountReducer, PayloadAction<IAccountState>> = (state, action) => {
  const account = action.payload
  state.data = state.data.filter(AccountHelper.predicateNot(account))
}

export const accountSliceReducers = {
  deleteAccount,
  saveAccount,
}
