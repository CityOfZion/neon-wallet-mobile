import { useCallback } from 'react'

import { BSKeychainHelper, type TBSAccount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@/helpers/AccountHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'

import { useEditAccount, useImportAccount } from './useAccountActions'
import { useAccountsWithWalletMapSelector, useAccountsWithWalletSelector } from './useAccountSelector'
import { useAppDispatch } from './useRedux'
import { useCreateWallet, useEditWallet } from './useWalletActions'

import { utilityReducerActions } from '@/store/reducers/utility'
import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount, TWallet } from '@/types/store'

export const useCreateHardwareWallet = () => {
  const { t: tCommon } = useTranslation('common')
  const { createWallet } = useCreateWallet()
  const { editAccount } = useEditAccount()
  const { importAccount } = useImportAccount()
  const { editWallet } = useEditWallet()
  const { accountsWithWalletMapRef } = useAccountsWithWalletMapSelector()

  const createHardwareWallet = useCallback(
    async (accounts: TBSAccount<TBlockchainServiceKey>[]) => {
      const existentWalletsByBlockchain = new Map<TBlockchainServiceKey, TWallet>()
      const groupedAccountInfosByBlockchain = new Map<
        TBlockchainServiceKey,
        {
          existentAccount?: TAccount
          account: TBSAccount<TBlockchainServiceKey>
        }[]
      >()

      // Group accounts by blockchain and check if the wallet already exists
      accounts.forEach(account => {
        const existentAccount = accountsWithWalletMapRef.current.get(AccountHelper.buildAccountKey(account))
        const existentWallet = existentAccount?.wallet
        const groupedInfo = groupedAccountInfosByBlockchain.get(account.blockchain) || []

        groupedInfo.push({ existentAccount, account })
        groupedAccountInfosByBlockchain.set(account.blockchain, groupedInfo)

        // If the wallet already exist, we reuse it
        if (existentWallet && !existentWalletsByBlockchain.has(account.blockchain)) {
          existentWalletsByBlockchain.set(account.blockchain, existentWallet)
        }
      })

      const newAccounts: TAccount[] = []
      const newWallets: TWallet[] = []

      for (const [blockchain, accountInfos] of groupedAccountInfosByBlockchain.entries()) {
        const existentWallet = existentWalletsByBlockchain.get(blockchain)

        let wallet: TWallet

        if (!existentWallet) {
          wallet = await createWallet({
            name: tCommon('wallet.ledgerName', { blockchain: tCommon(`blockchain.${blockchain}`) }),
            type: 'hardware',
            backupStatus: 'successful',
          })
        } else {
          wallet = await editWallet({
            wallet: existentWallet,
            data: {
              name: tCommon('wallet.ledgerName', { blockchain: tCommon(`blockchain.${blockchain}`) }),
              type: 'hardware',
            },
          })
        }

        newWallets.push(wallet)

        for (const info of accountInfos) {
          let account: TAccount | undefined

          if (info.existentAccount) {
            account = await editAccount({
              account: info.existentAccount,
              data: {
                key: info.account.key,
                type: 'hardware',
              },
            })
          } else {
            account = await importAccount({
              address: info.account.address,
              blockchain: info.account.blockchain,
              type: 'hardware',
              key: info.account.key,
              wallet,
              order: BSKeychainHelper.extractIndexFromPath(info.account.bipPath!),
            })
          }

          newAccounts.push(account)
        }
      }

      return { newAccounts, newWallets }
    },
    [accountsWithWalletMapRef, createWallet, tCommon, editWallet, editAccount, importAccount]
  )

  return { createHardwareWallet }
}

export const useHardwareWalletAddAccount = () => {
  const { accountsWithWalletRef } = useAccountsWithWalletSelector()
  const { t: tCommon } = useTranslation('common')
  const { importAccount } = useImportAccount()
  const dispatch = useAppDispatch()

  const addHardwareAccount = useCallback(
    async (wallet: TWallet, accountName?: string) => {
      if (wallet.type !== 'hardware') {
        throw new AppError(tCommon('hardwareWallet.errors.accountIsNotHardware'))
      }

      const firstWalletAccount = accountsWithWalletRef.current.find(account => account.idWallet === wallet.id)
      if (!firstWalletAccount) {
        throw new AppError(tCommon('hardwareWallet.errors.blockchainNotFound'))
      }

      // When a wallet is hardware, all accounts are from the same blockchain
      const blockchain = firstWalletAccount?.blockchain
      const accountOrder = AccountHelper.getNextOrderOrMissing(accountsWithWalletRef.current, blockchain, wallet.id)
      const serviceAccount = await HardwareWalletHelper.getAccount({ blockchain, index: accountOrder })

      const account = await importAccount({
        ...serviceAccount,
        type: 'hardware',
        wallet,
        order: accountOrder,
        name: accountName,
      })

      const firstAccount = await HardwareWalletHelper.getAccount({ blockchain, index: 0 })

      dispatch(
        utilityReducerActions.saveLastIndexByWallet({
          firstAccountAddress: firstAccount.address,
          index: accountOrder,
          blockchain,
        })
      )
      return account
    },
    [accountsWithWalletRef, tCommon, dispatch, importAccount]
  )

  return {
    addHardwareAccount,
  }
}
