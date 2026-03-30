import { useRef } from 'react'

import _ from 'lodash'
import { useSelector } from 'react-redux'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { SelectorHelper } from '@/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootState } from '@/types/redux'
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
  const accountsWithWalletMapRef = useRef<Map<string, TAccountWithWallet>>(new Map())

  useSelector((state: TRootState) => {
    const result = selectAccountsWithWallet(state)

    accountsWithWalletMapRef.current = new Map<string, TAccountWithWallet>()

    result.forEach(account => {
      accountsWithWalletMapRef.current.set(AccountHelper.buildAccountKey(account), account)
    })
  })

  return { accountsWithWalletMapRef }
}

export const useAccountsMapSelector = () => {
  const accountsMapRef = useRef<Map<string, TAccount>>(new Map())

  useSelector((state: TRootState) => {
    const result = selectAccounts(state)

    accountsMapRef.current = new Map<string, TAccount>()

    result.forEach(account => {
      accountsMapRef.current.set(AccountHelper.buildAccountKey(account), account)
    })
  })

  return { accountsMapRef }
}
