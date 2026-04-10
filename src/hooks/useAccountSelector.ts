import _ from 'lodash'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { SelectorHelper } from '@/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount, TAccountWithWallet } from '@/types/store'

const orderAccounts = <T extends TAccount = TAccount>(accounts: T[]): T[] =>
  _.orderBy(
    [...accounts],
    [({ blockchain }) => BlockchainServiceHelper.blockchainNames.indexOf(blockchain), 'order'],
    ['asc', 'asc']
  )

const selectAccountsWithWallet = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) =>
    SelectorHelper.fallbackToEmptyArray<TAccountWithWallet>(
      orderAccounts<TAccountWithWallet>(
        accounts.map(account => {
          const wallet = wallets.find(wallet => wallet.id === account.idWallet)!

          return { ...account, wallet }
        })
      )
    )
)

export const selectAccountsByWalletId = (walletId?: string) =>
  createAppSelector([state => state.account.data], accounts => {
    if (!walletId) return SelectorHelper.fallbackToEmptyArray<TAccount>()

    return SelectorHelper.fallbackToEmptyArray<TAccount>(
      orderAccounts(accounts.filter(({ idWallet }) => idWallet === walletId))
    )
  })

const selectOwnAccounts = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) => {
    const response: TAccount[] = []

    accounts.forEach(account => {
      const wallet = wallets.find(({ id }) => id === account.idWallet)

      if (account.type === 'watch' && wallet?.type !== 'hardware') return

      response.push(account)
    })

    return SelectorHelper.fallbackToEmptyArray<TAccount>(orderAccounts(response))
  }
)

const selectHasHardwareAccount = createAppSelector([state => state.account.data], accounts => {
  return accounts.some(account => account.type === 'hardware')
})

export const selectAccounts = createAppSelector([state => state.account.data], accounts =>
  SelectorHelper.fallbackToEmptyArray<TAccount>(orderAccounts(accounts))
)

export const selectAccountsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector([({ account }) => account.data], (accounts): TAccount[] => {
    if (blockchains.length === 0) return SelectorHelper.fallbackToEmptyArray<TAccount>()

    return SelectorHelper.fallbackToEmptyArray<TAccount>(
      orderAccounts(accounts.filter(account => blockchains.some(blockchain => blockchain === account.blockchain)))
    )
  })

const selectAccountsWithWalletMap = createAppSelector([selectAccountsWithWallet], accountsWithWallet => {
  const map = new Map<string, TAccountWithWallet>()
  accountsWithWallet.forEach(account => {
    map.set(AccountHelper.buildAccountKey(account), account)
  })
  return map
})

const selectAccountsMap = createAppSelector([selectAccounts], accounts => {
  const map = new Map<string, TAccount>()
  accounts.forEach(account => {
    map.set(AccountHelper.buildAccountKey(account), account)
  })
  return map
})

export const useAccountsSelector = () => {
  const { value, ref } = useAppSelector(selectAccounts)

  return { accounts: value, accountsRef: ref }
}

export const useOwnAccountsSelector = () => {
  const { value: ownAccounts, ref: ownAccountsRef } = useAppSelector(selectOwnAccounts)

  return { ownAccounts, ownAccountsRef }
}

export const useAccountByIdSelector = (id: string) => {
  const { value, ref } = useAppSelector(state => state.account.data.find(account => account.id === id)!)

  return { account: value, accountRef: ref }
}

export const useAccountsWithWalletSelector = () => {
  const { value, ref } = useAppSelector<TAccountWithWallet[]>(selectAccountsWithWallet)

  return { accountsWithWallet: value, accountsWithWalletRef: ref }
}

export const useAccountsByWalletIdSelector = (walletId?: string) => {
  const { value, ref } = useAppSelector(selectAccountsByWalletId(walletId))

  return { accountsByWalletId: value, accountsByWalletIdRef: ref }
}

export const useHasHardwareAccountSelector = () => {
  const { value, ref } = useAppSelector(selectHasHardwareAccount)

  return { hasHardwareAccount: value, hasHardwareAccountRef: ref }
}

export const useAccountsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: accountsByBlockchains, ref: accountsByBlockchainsRef } = useAppSelector(
    selectAccountsByBlockchains(blockchains)
  )

  return { accountsByBlockchains, accountsByBlockchainsRef }
}

export const useAccountsWithWalletMapSelector = () => {
  const { ref: accountsWithWalletMapRef, value: accountsWithWalletMap } = useAppSelector(selectAccountsWithWalletMap)
  return { accountsWithWalletMapRef, accountsWithWalletMap }
}

export const useAccountsMapSelector = () => {
  const { ref: accountsMapRef, value: accountsMap } = useAppSelector(selectAccountsMap)
  return { accountsMapRef, accountsMap }
}
