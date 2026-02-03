import { useCallback } from 'react'

import { useTranslation } from 'react-i18next'

import { AppError } from '@/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useDeleteAccount } from './useAccountActions'
import { useAccountsSelector } from './useAccountSelector'
import { useAppDispatch } from './useRedux'
import { useWalletsSelector } from './useWalletSelector'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TUseCreateWalletParams, TUseEditWalletParams } from '@/types/hooks'
import type { IWalletState } from '@/types/store'

export const useCreateWallet = () => {
  const dispatch = useAppDispatch()
  const { t: tCommon } = useTranslation('common')

  const createWallet = useCallback(
    async ({ name, backupStatus, mnemonic, id, type = 'standard' }: TUseCreateWalletParams) => {
      const generatedId = id ?? UtilsHelper.uuid()

      const newWallet: IWalletState = {
        name,
        id: generatedId,
        backupStatus: backupStatus ?? (type === 'standard' ? 'unsuccessful' : 'successful'),
        type,
      }

      if (type === 'standard') {
        if (!mnemonic) throw new AppError(tCommon('errors.mustHaveMnemonic'))

        await SecureStoreHelper.saveMnemonic(newWallet, mnemonic)
      }

      dispatch(walletReducerActions.saveWallet(newWallet))

      return newWallet
    },
    [dispatch, tCommon]
  )

  return { createWallet }
}

export const useDeleteWallet = () => {
  const dispatch = useAppDispatch()
  const { accountsRef } = useAccountsSelector()
  const { deleteAccount } = useDeleteAccount()

  const deleteWallet = useCallback(
    async (wallet: IWalletState) => {
      try {
        const accounts = accountsRef.current.filter(account => account.idWallet === wallet.id)
        await Promise.allSettled(accounts.map(account => deleteAccount(account)))

        const isHardwareWalletConnected =
          wallet.type === 'hardware' && accounts.some(account => account.type === 'hardware')
        if (isHardwareWalletConnected) {
          HardwareWalletHelper.disconnect()
        }
      } catch {
        // Empty block
      }

      dispatch(walletReducerActions.deleteWallet(wallet.id))
    },
    [accountsRef, deleteAccount, dispatch]
  )

  return { deleteWallet }
}

export const useEditWallet = () => {
  const dispatch = useAppDispatch()
  const { walletsRef } = useWalletsSelector()

  const editWallet = useCallback(
    async ({ data, wallet }: TUseEditWalletParams) => {
      if (data.mnemonic) {
        await SecureStoreHelper.saveMnemonic(wallet, data.mnemonic)
        delete data.mnemonic
      }

      const updatedWallet = walletsRef.current.find(({ id }) => id === wallet.id)!
      const editedWallet: IWalletState = Object.assign({}, updatedWallet, data)

      dispatch(walletReducerActions.saveWallet(editedWallet))

      return editedWallet
    },
    [dispatch, walletsRef]
  )

  return { editWallet }
}
