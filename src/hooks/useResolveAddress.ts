import { useCallback } from 'react'

import { AccountHelper } from '@/helpers/AccountHelper'

import { useAccountsSelector } from './useAccountSelector'
import { useContactsSelector } from './useContactSelector'
import { useWalletsSelector } from './useWalletSelector'

import type { TAccountHelperPredicateParams } from '@/types/helpers'

export const useResolveAddress = () => {
  const { accounts } = useAccountsSelector()
  const { contacts } = useContactsSelector()
  const { wallets } = useWalletsSelector()

  const resolveAddress = useCallback(
    (predicateParams: TAccountHelperPredicateParams) => {
      const foundAccount = accounts.find(AccountHelper.predicate(predicateParams))
      const foundWallet = foundAccount ? wallets.find(wallet => wallet.id === foundAccount.idWallet) : undefined
      const foundContact = contacts.find(contact =>
        contact.addresses.some(contactAddress => contactAddress.address === predicateParams.address)
      )

      return {
        foundAccount,
        foundWallet,
        foundContact,
      }
    },
    [accounts, contacts, wallets]
  )

  return { resolveAddress }
}
