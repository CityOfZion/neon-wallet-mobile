import { SelectorHelper } from '@/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TWallet } from '@/types/store'

const selectStandardWallets = createAppSelector([state => state.wallet.data], wallets =>
  SelectorHelper.fallbackToEmptyArray<TWallet>(wallets.filter(({ type }) => type === 'standard'))
)

const selectOwnWallets = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) =>
    SelectorHelper.fallbackToEmptyArray<TWallet>(
      wallets.filter(wallet => accounts.some(account => account.idWallet === wallet.id && account.type !== 'watch'))
    )
)

export const selectWalletById = (walletId: string) =>
  createAppSelector([state => state.wallet.data], wallets => wallets.find(wallet => wallet.id === walletId)!)

export const useWalletsSelector = () => {
  const { value, ref } = useAppSelector(state => state.wallet.data)

  return { wallets: value, walletsRef: ref }
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
