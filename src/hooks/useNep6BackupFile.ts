import { useTranslation } from 'react-i18next'

import { Nep6Helper } from '@/helpers/Nep6Helper'
import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import { useImportAccounts } from './useAccountActions'
import { useCreateWallet } from './useWalletActions'

import type {
  TUseImportNep6Account,
  TUseImportNep6DecryptedAccount,
  TUseNep6Data,
  TUseNep6GeneratedData,
} from '@/types/hooks'

export const useNep6BackupFile = () => {
  const { t: tCommonWallet } = useTranslation('common', { keyPrefix: 'wallet' })
  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const validateAndParseFile = (fileContent: string): TUseNep6Data | undefined => {
    try {
      const parsedContent = JSON.parse(fileContent)
      const validatedContent = ValidationSchemaHelper.parseNep6Backup(parsedContent)

      const accounts = Nep6Helper.transformAccounts(validatedContent.accounts)

      if (accounts.length === 0) {
        return undefined
      }

      return { content: { accounts }, type: 'nep6' }
    } catch {
      return undefined
    }
  }

  const handleTryDecryptAccount = (account: TUseImportNep6Account, password: string) =>
    Nep6Helper.decryptAccount(account, password)

  const handleGenerateData = (decryptedAccounts: TUseImportNep6DecryptedAccount[]): TUseNep6GeneratedData => {
    const accountsToCreate: TUseNep6GeneratedData['accountsToCreate'] = []

    decryptedAccounts.forEach(({ address, blockchain, decryptedKey, label }) => {
      accountsToCreate.push({ address, blockchain, key: decryptedKey, type: 'standard', name: label })
    })

    return {
      walletToCreate: { name: tCommonWallet('importedName'), type: 'non-standard', backupStatus: 'successful' },
      accountsToCreate,
    }
  }

  const handleImportBackupData = async (data: TUseNep6GeneratedData) => {
    const wallet = await createWallet(data.walletToCreate)
    const accounts = await importAccounts({ wallet, accountsToImport: data.accountsToCreate })

    return { wallet, accounts }
  }

  return {
    validateAndParseFile,
    handleTryDecryptAccount,
    handleGenerateData,
    handleImportBackupData,
  }
}
