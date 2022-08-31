import { createSelector } from '@reduxjs/toolkit'
import { plainToClass } from 'class-transformer'

import { RootState } from '../RootStore'

import { Wallet } from '~/src/models/redux/Wallet'

const rootState = (state: RootState) => state

export const selectWallets = createSelector(rootState, state => plainToClass(Wallet, state.wallet.data))

export const selectWalletIds = createSelector(
  rootState,
  state => state.wallet.data.map(wallet => wallet.id).filter(id => id !== null) as string[]
)

export const selectWalletByID = (idWallet: string | null) =>
  createSelector(rootState, state => {
    const foundWallet = state.wallet.data.find(wallet => wallet.id === idWallet)
    if (foundWallet) {
      return plainToClass(Wallet, foundWallet)
    }
    return undefined
  })

export const selectSelectedWallet = createSelector(
  rootState,
  state => plainToClass(Wallet, state.wallet.selectedWallet)
)