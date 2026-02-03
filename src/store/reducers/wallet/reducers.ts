import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import type { IWalletReducer } from './index'

import type { IWalletState } from '@/types/store'

const saveWallet: CaseReducer<IWalletReducer, PayloadAction<IWalletState>> = (state, action) => {
  const wallet = ValidationSchemaHelper.parseWallet(action.payload)

  const indexWallet = state.data.findIndex(it => it.id === wallet.id)
  if (indexWallet < 0) {
    state.data = [...state.data, wallet]
    return
  }

  state.data[indexWallet] = wallet
}

const deleteWallet: CaseReducer<IWalletReducer, PayloadAction<string>> = (state, action) => {
  const idWallet = action.payload
  state.data = state.data.filter(it => it.id !== idWallet)
}

const reorder: CaseReducer<IWalletReducer, PayloadAction<IWalletState[]>> = (state, action) => {
  state.data = action.payload
}

export const walletSliceReducers = {
  deleteWallet,
  reorder,
  saveWallet,
}
