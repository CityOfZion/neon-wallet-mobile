import crypto from 'crypto'
import * as ExpoCrypto from 'expo-crypto'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { NeonBackupHelper } from '@/helpers/NeonBackupHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import type {
  TValidationSchemaHelperBackupAccountSchema,
  TValidationSchemaHelperBackupDataSchema,
  TValidationSchemaHelperBackupFileSchema,
} from '@/helpers/ValidationSchemaHelper'
import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import { useDoesAccountExist, useImportAccounts } from './useAccountActions'
import { useAccountsSelector } from './useAccountSelector'
import { useContactsSelector } from './useContactSelector'
import { useFileSystem } from './useFileSystem'
import { useAppDispatch } from './useRedux'
import { useSwapRecordsSelector } from './useSwapRecordsSelector'
import { useCreateWallet, useEditWallet } from './useWalletActions'
import { useWalletsSelector } from './useWalletSelector'

import { contactReducerActions } from '@/store/reducers/contact'
import { utilityReducerActions } from '@/store/reducers/utility'
import type { TUseImportAccountsParams } from '@/types/hooks'
import type { TContactAddress } from '@/types/store'

export const useNeonCreateBackup = () => {
  const { swapRecords } = useSwapRecordsSelector()
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const { contacts } = useContactsSelector()
  const { editWallet } = useEditWallet()

  const { writeFile } = useFileSystem()

  const handleCreateBackupFormat = async () => {
    const backupFile: TValidationSchemaHelperBackupDataSchema = {
      wallets: [],
      contacts: [],
      swapRecords: [],
    }

    backupFile.contacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      addresses: contact.addresses.map(address => ({ address: address.address, blockchain: address.blockchain })),
    }))

    backupFile.swapRecords = swapRecords.map(swap => ({
      account: swap.account,
      swapId: swap.swapId,
      addressTo: swap.addressTo,
      extraIdTo: swap.extraIdTo,
      amountFrom: swap.amountFrom,
      amountTo: swap.amountTo,
      swapProvider: swap.swapProvider,
      swapStatus: swap.swapStatus,
      tokenFrom: swap.tokenFrom,
      tokenTo: swap.tokenTo,
      fee: swap.fee,
      txFrom: swap.txFrom,
      txTo: swap.txTo,
    }))

    const backupAccountsByWalletId = new Map<string, TValidationSchemaHelperBackupAccountSchema[]>()

    const accountPromises = accounts.map(async account => {
      const key = await SecureStoreHelper.getKey(account)

      const backupAccount: TValidationSchemaHelperBackupAccountSchema = {
        id: account.id,
        idWallet: account.idWallet,
        address: account.address,
        blockchain: account.blockchain,
        name: account.name,
        order: account.order,
        type: account.type,
        key: key ?? undefined,
        skin: account.skin,
      }

      const walletAccounts = backupAccountsByWalletId.get(backupAccount.idWallet) ?? []
      backupAccountsByWalletId.set(backupAccount.idWallet, [...walletAccounts, backupAccount])
    })

    await Promise.all(accountPromises)

    const walletPromises = wallets.map(async wallet => {
      const mnemonic = await SecureStoreHelper.getMnemonic(wallet)

      await editWallet({ wallet, data: { backupStatus: 'successful' } })

      const walletAccounts = backupAccountsByWalletId.get(wallet.id) ?? []

      backupFile.wallets.push({
        id: wallet.id,
        name: wallet.name,
        // It is always standard because we are following the NWD format
        type: 'standard',
        mnemonic: mnemonic ?? undefined,
        accounts: walletAccounts,
      })
    })

    await Promise.all(walletPromises)

    return backupFile
  }

  const handleCreateBackup = async (password: string) => {
    const backupFileData = await handleCreateBackupFormat()
    const backupFileDataString = JSON.stringify(backupFileData)
    const iv = ExpoCrypto.getRandomBytes(16)
    const key = crypto.pbkdf2Sync(password, 'salt', 100000, 24, 'sha256')
    const cipher = crypto.createCipheriv(NeonBackupHelper.algorithm, key as any, iv)
    const encrypted =
      Buffer.from(iv).toString('hex') + cipher.update(backupFileDataString, 'utf8', 'hex') + cipher.final('hex')

    const backupFile: TValidationSchemaHelperBackupFileSchema = {
      version: NeonBackupHelper.version,
      data: encrypted,
    }

    await writeFile(
      `Neon-Backup-${DateHelper.getNowUnix()}.${NeonBackupHelper.fileExtension}`,
      JSON.stringify(backupFile),
      'application/json'
    )
  }

  return {
    handleCreateBackup,
  }
}

export const useNeonImportBackup = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useNeonImportBackup' })
  const dispatch = useAppDispatch()
  const { createWallet } = useCreateWallet()
  const { doesAccountExist } = useDoesAccountExist()
  const { importAccounts } = useImportAccounts()
  const { readFile } = useFileSystem()

  const handleBrowserFile = async () => {
    const file = await readFile('application/json')
    if (!file) return

    const isBackupFile = file.name.endsWith(`.${NeonBackupHelper.fileExtension}.json`)
    if (!isBackupFile) throw new AppError(t('errors.wrongFile', { extension: NeonBackupHelper.fileExtension }))

    try {
      const backupFile = JSON.parse(file.content)
      const validatedFile = ValidationSchemaHelper.paseBackupFile(backupFile)

      if (validatedFile.version !== NeonBackupHelper.version) throw new AppError(t('errors.wrongVersion'))

      return validatedFile
    } catch (error) {
      throw new AppError(t('errors.deprecatedFile'), error)
    }
  }

  const handleTryDecryptData = (file: TValidationSchemaHelperBackupFileSchema, password: string) => {
    try {
      const iv = Buffer.from(file.data.slice(0, 32), 'hex')
      const key = crypto.pbkdf2Sync(password, 'salt', 100000, 24, 'sha256')
      const decipher = crypto.createDecipheriv(NeonBackupHelper.algorithm, key as any, iv as any)
      const decrypted = decipher.update(file.data.slice(32), 'hex', 'utf8') + decipher.final('utf8')
      const parsedData = JSON.parse(decrypted)

      return ValidationSchemaHelper.parseBackupData(parsedData)
    } catch (error) {
      throw new AppError(t('errors.wrongPassword'), error)
    }
  }

  const handleImportBackupData = async (data: TValidationSchemaHelperBackupDataSchema) => {
    try {
      data.swapRecords?.forEach(swap => {
        const account = NeonBackupHelper.fixAccountProperties(swap.account)
        if (!account) return
        dispatch(
          utilityReducerActions.saveSwapRecord({
            addressTo: swap.addressTo,
            extraIdTo: swap.extraIdTo,
            amountFrom: swap.amountFrom,
            amountTo: swap.amountTo,
            fee: swap.fee,
            swapId: swap.swapId,
            swapProvider: swap.swapProvider,
            tokenFrom: swap.tokenFrom,
            tokenTo: swap.tokenTo,
            txFrom: swap.txFrom,
            swapStatus: swap.swapStatus,
            txTo: swap.txTo,
            account,
          })
        )
      })

      data.contacts.forEach(contact => {
        const addresses: TContactAddress[] = []
        contact.addresses.forEach(address => {
          if (!BlockchainServiceHelper.doesBlockchainSupported(address.blockchain)) return
          addresses.push({ address: address.address, blockchain: address.blockchain })
        })
        dispatch(
          contactReducerActions.saveContact({
            id: contact.id,
            name: contact.name,
            addresses,
          })
        )
      })

      for (const backupWallet of data.wallets) {
        const accountsToImport: TUseImportAccountsParams['accounts'] = []

        backupWallet.accounts.forEach(backupAccount => {
          const fixedAccount = NeonBackupHelper.fixAccountProperties(backupAccount)

          if (!fixedAccount || doesAccountExist(fixedAccount)) return

          accountsToImport.push({ ...fixedAccount, key: backupAccount.key })
        })

        if (accountsToImport.length === 0) continue

        const fixedWallet = NeonBackupHelper.fixWalletProperties(backupWallet)
        const newWallet = await createWallet({ ...fixedWallet, mnemonic: backupWallet.mnemonic })

        await importAccounts({ wallet: newWallet, accounts: accountsToImport })
      }
    } catch (error) {
      throw new AppError(t('errors.importData'), error)
    }
  }

  return {
    handleBrowserFile,
    handleTryDecryptData,
    handleImportBackupData,
  }
}
