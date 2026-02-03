import { useRef } from 'react'

import _ from 'lodash'
import { useSelector } from 'react-redux'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootState } from '@/types/redux'
import type { IAccountState, TAccountWithWallet } from '@/types/store'

const EMPTY_ARRAY: any[] = []

const orderAccounts = <T extends IAccountState>(accounts: T[]): T[] =>
  _.orderBy(
    [...accounts],
    [({ blockchain }) => BlockchainServiceHelper.blockchainNames.indexOf(blockchain), 'order'],
    ['asc', 'asc']
  )

const selectAccountsWithWallet = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) =>
    orderAccounts(
      accounts.map(account => {
        const wallet = wallets.find(wallet => wallet.id === account.idWallet)!

        return { ...account, wallet }
      })
    )
)

export const selectAccountByWalletId = (walletId?: string) =>
  createAppSelector([state => state.account.data], accounts => {
    if (!walletId) return EMPTY_ARRAY as IAccountState[]
    return orderAccounts(accounts.filter(account => account.idWallet === walletId))
  })

const selectOwnAccounts = createAppSelector(
  [state => state.wallet.data, state => state.account.data],
  (wallets, accounts) => {
    const response: IAccountState[] = []

    accounts.forEach(account => {
      const wallet = wallets.find(wallet => wallet.id === account.idWallet)!

      if (account.type === 'watch' && wallet.type !== 'hardware') return

      response.push(account)
    })

    return orderAccounts(response)
  }
)

const selectHasHardwareAccount = createAppSelector([state => state.account.data], accounts => {
  return accounts.some(account => account.type === 'hardware')
})

export const selectAccounts = createAppSelector([state => state.account.data], accounts => orderAccounts(accounts))

export const selectAccountsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector([({ account }) => account.data], (accounts): IAccountState[] => {
    if (blockchains.length === 0) return EMPTY_ARRAY

    return orderAccounts(accounts.filter(account => blockchains.some(blockchain => blockchain === account.blockchain)))
  })

export const useAccountsSelector = () => {
  const { ref, value } = useAppSelector(selectAccounts)
  return {
    accounts: value,
    accountsRef: ref,
  }
}

export const useOwnAccountsSelector = () => {
  const { value: ownAccounts, ref: ownAccountsRef } = useAppSelector(selectOwnAccounts)

  return {
    ownAccounts,
    ownAccountsRef,
  }
}

export const useAccountByIdSelector = (id: string) => {
  const { ref, value } = useAppSelector(state => state.account.data.find(account => account.id === id)!)
  return {
    account: value,
    accountRef: ref,
  }
}

export const useAccountsWithWalletSelector = () => {
  const { ref, value } = useAppSelector<TAccountWithWallet[]>(selectAccountsWithWallet)

  return {
    accountsWithWallet: value,
    accountsWithWalletRef: ref,
  }
}

export const useAccountsByWalletIdSelector = (walletId?: string) => {
  const { value, ref } = useAppSelector(selectAccountByWalletId(walletId))

  return {
    accountsByWalletId: value,
    accountsByWalletIdRef: ref,
  }
}

export const useHasHardwareAccountSelector = () => {
  const { ref, value } = useAppSelector(selectHasHardwareAccount)

  return {
    hasHardwareAccount: value,
    hasHardwareAccountRef: ref,
  }
}

export const useAccountsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: accountsByBlockchains, ref: accountsByBlockchainsRef } = useAppSelector(
    selectAccountsByBlockchains(blockchains)
  )

  return { accountsByBlockchains, accountsByBlockchainsRef }
}

export const useAccountMapSelector = () => {
  const accountsMapRef = useRef<Map<string, TAccountWithWallet>>(new Map())

  useSelector((state: TRootState) => {
    const result = selectAccountsWithWallet(state)
    accountsMapRef.current = new Map<string, TAccountWithWallet>()
    result.forEach(account => {
      accountsMapRef.current.set(AccountHelper.buildAccountKey(account), account)
    })
  })

  return {
    accountsMapRef,
  }
}
