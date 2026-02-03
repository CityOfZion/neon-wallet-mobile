import { useRef } from 'react'

import { useSelector } from 'react-redux'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TRootState } from '@/types/redux'
import type { IWalletState } from '@/types/store'

const selectStandardWallets = createAppSelector([state => state.wallet.data], wallets =>
  wallets.filter(({ type }) => type === 'standard')
)

const selectOwnWallets = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) =>
    wallets.filter(wallet => accounts.some(account => account.idWallet === wallet.id && account.type !== 'watch'))
)

export const selectWalletById = (walletId: string) =>
  createAppSelector([state => state.wallet.data], wallets => wallets.find(wallet => wallet.id === walletId)!)

export const useWalletsSelector = () => {
  const { ref, value } = useAppSelector(state => state.wallet.data)
  return {
    wallets: value,
    walletsRef: ref,
  }
}

export const useStandardWalletsSelector = () => {
  const { value: wallets, ref: walletsRef } = useAppSelector(selectStandardWallets)

  return { wallets, walletsRef }
}

export const useOwnWalletsSelector = () => {
  const { value: wallets, ref: walletsRef } = useAppSelector(selectOwnWallets)

  return { wallets, walletsRef }
}

export const useWalletByIdSelector = (id: string) => {
  const { value, ref } = useAppSelector(selectWalletById(id))
  return { wallet: value, walletRef: ref }
}

export const useWalletsMapSelector = () => {
  const walletsMapRef = useRef<Map<string, IWalletState>>(new Map())

  useSelector((state: TRootState) => {
    walletsMapRef.current = new Map<string, IWalletState>()
    state.wallet.data.forEach(wallet => {
      walletsMapRef.current.set(wallet.id, wallet)
    })
  })

  return {
    walletsMapRef,
  }
}
