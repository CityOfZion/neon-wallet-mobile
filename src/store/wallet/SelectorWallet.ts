import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'
import { Wallet } from './Wallet'

const rootState = (state: RootState) => state

export const selectWallets = createSelector(rootState, state => state.wallet.data.map(wallet => new Wallet(wallet)))

export const selectWalletIds = createSelector(
  rootState,
  state => state.wallet.data.map(wallet => wallet.id).filter(id => id !== null) as string[]
)

export const selectWalletByID = (idWallet: string | null) =>
  createSelector(rootState, state => {
    const foundWallet = state.wallet.data.find(wallet => wallet.id === idWallet)
    if (foundWallet) {
      return new Wallet(foundWallet)
    }
    return undefined
  })
