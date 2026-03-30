import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import type { TWalletReducer } from './index'

import type { TWallet } from '@/types/store'

const saveWallet: CaseReducer<TWalletReducer, PayloadAction<TWallet>> = (state, action) => {
  const wallet = ValidationSchemaHelper.parseWallet(action.payload)
  const walletIndex = state.data.findIndex(({ id }) => id === wallet.id)

  if (walletIndex < 0) {
    state.data = [...state.data, wallet]

    return
  }

  state.data[walletIndex] = wallet
}

const deleteWallet: CaseReducer<TWalletReducer, PayloadAction<string>> = (state, action) => {
  const walletId = action.payload

  state.data = state.data.filter(({ id }) => id !== walletId)
}

const reorder: CaseReducer<TWalletReducer, PayloadAction<TWallet[]>> = (state, action) => {
  state.data = action.payload
}

export const walletSliceReducers = {
  deleteWallet,
  reorder,
  saveWallet,
}
