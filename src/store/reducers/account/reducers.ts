import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { AccountHelper } from '@/helpers/AccountHelper'
import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import type { TAccountReducer } from '.'

import type { TAccount } from '@/types/store'

const saveAccount: CaseReducer<TAccountReducer, PayloadAction<TAccount>> = (state, action) => {
  const account = ValidationSchemaHelper.parseAccount(action.payload)
  const foundIndex = state.data.findIndex(account => account.id === action.payload.id)

  if (foundIndex < 0) {
    state.data = [...state.data, account]

    return
  }

  state.data[foundIndex] = account
}

const deleteAccount: CaseReducer<TAccountReducer, PayloadAction<TAccount>> = (state, action) => {
  const account = action.payload

  state.data = state.data.filter(AccountHelper.predicateNot(account))
}

export const accountSliceReducers = {
  deleteAccount,
  saveAccount,
}
