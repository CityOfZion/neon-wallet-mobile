import { useCallback } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { SkinHelper } from '@/helpers/SkinHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAccountMapSelector, useAccountsSelector } from './useAccountSelector'
import { useAppDispatch } from './useRedux'

import { accountReducerActions } from '@/store/reducers/account'
import { utilityReducerActions } from '@/store/reducers/utility'
import type { TAccountHelperPredicateParams } from '@/types/helpers'
import type {
  TUseCreateAccountParams,
  TUseEditAccountParams,
  TUseImportAccountParams,
  TUseImportAccountsParams,
} from '@/types/hooks'
import type { IAccountState } from '@/types/store'

export const useCreateAccount = () => {
  const dispatch = useAppDispatch()
  const { accountsRef } = useAccountsSelector()
  const { t: tCommon } = useTranslation('common')

  const createAccount = useCallback(
    async ({ blockchain, name, wallet, id }: TUseCreateAccountParams): Promise<IAccountState> => {
      const mnemonic = await SecureStoreHelper.getMnemonic(wallet)
      if (!mnemonic) throw new AppError(tCommon('errors.unexpected'))

      const order = AccountHelper.getNextOrderOrMissing(accountsRef.current, blockchain, wallet.id)
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
      const serviceAccount = await service.generateAccountFromMnemonic(mnemonic, order)

      const newAccount: IAccountState = {
        id: id ?? UtilsHelper.uuid(),
        idWallet: wallet.id,
        name: name ?? `${tCommon(`blockchainServices.${blockchain}.accountName`)} ${order + 1}`,
        blockchain,
        skin: { type: 'color', id: SkinHelper.getSkinColor() },
        address: serviceAccount.address,
        type: 'standard',
        order,
      }

      await SecureStoreHelper.saveKey(newAccount, serviceAccount.key)

      dispatch(accountReducerActions.saveAccount(newAccount))

      const firstAccount = await service.generateAccountFromMnemonic(mnemonic, 0)
      dispatch(
        utilityReducerActions.saveLastIndexByWallet({
          firstAccountAddress: firstAccount.address,
          index: order,
          blockchain,
        })
      )

      return newAccount
    },
    [accountsRef, tCommon, dispatch]
  )

  return { createAccount }
}

export const useImportAccount = () => {
  const dispatch = useAppDispatch()
  const { accountsRef } = useAccountsSelector()
  const { t: commonT } = useTranslation('common')

  const importAccount = useCallback(
    async ({ address, blockchain, type, wallet, key, name, skin, order }: TUseImportAccountParams) => {
      const currentOrder = order ?? AccountHelper.getNextOrderOrMissing(accountsRef.current, blockchain, wallet.id)

      const newAccount: IAccountState = {
        id: UtilsHelper.uuid(),
        idWallet: wallet.id,
        name: name ?? `${commonT(`blockchainServices.${blockchain}.accountName`)} ${currentOrder + 1}`,
        blockchain,
        skin: skin ?? { type: 'color', id: SkinHelper.getSkinColor() },
        address,
        type,
        order: currentOrder,
      }

      if (type !== 'watch') {
        if (!key) throw new AppError(commonT('errors.mustHaveKey'))

        await SecureStoreHelper.saveKey(newAccount, key)
      }

      dispatch(accountReducerActions.saveAccount(newAccount))

      return newAccount
    },
    [accountsRef, commonT, dispatch]
  )

  return { importAccount }
}

export const useImportAccounts = () => {
  const { importAccount } = useImportAccount()

  const importAccounts = useCallback(
    async ({ accountsToImport, wallet }: TUseImportAccountsParams) => {
      const accounts = []

      for (const accountToImport of accountsToImport) accounts.push(await importAccount({ ...accountToImport, wallet }))

      return accounts
    },
    [importAccount]
  )

  return { importAccounts }
}

export const useDeleteAccount = () => {
  const dispatch = useAppDispatch()

  const deleteAccount = useCallback(
    async (account: IAccountState) => {
      dispatch(accountReducerActions.deleteAccount(account))

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
      if (!hasWalletConnect(service)) return

      const sessions = WalletKitHelper.kit.getActiveSessions()
      const accountSessions = BSWalletKitHelper.filterSessions(Object.values(sessions), {
        addresses: [account.address],
        chains: [service.walletConnectService.chain],
      })
      await Promise.allSettled(
        accountSessions.map(session =>
          WalletKitHelper.kit.disconnectSession({
            topic: session.topic,
            reason: BSWalletKitHelper.getError('USER_DISCONNECTED'),
          })
        )
      )
    },
    [dispatch]
  )

  return { deleteAccount }
}

export const useEditAccount = () => {
  const dispatch = useAppDispatch()
  const { accountsRef } = useAccountsSelector()

  const editAccount = useCallback(
    async ({ account, data }: TUseEditAccountParams) => {
      if (data.key) {
        await SecureStoreHelper.saveKey(account, data.key)
        delete data.key
      }

      const updatedAccount = accountsRef.current.find(({ id }) => id === account.id)!
      const editedAccount: IAccountState = Object.assign({}, updatedAccount, data)

      dispatch(accountReducerActions.saveAccount(editedAccount))

      return editedAccount
    },
    [accountsRef, dispatch]
  )

  return { editAccount }
}

export const useDoesAccountExist = () => {
  const { accountsMapRef } = useAccountMapSelector()

  const doesAccountExist = useCallback(
    (params: TAccountHelperPredicateParams) => accountsMapRef.current.has(AccountHelper.buildAccountKey(params)),
    [accountsMapRef]
  )

  return {
    doesAccountExist,
  }
}
