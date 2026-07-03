import { hasNameService } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { Nep6Helper } from '@/helpers/Nep6Helper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { ValidationSchemaHelper } from '@/helpers/ValidationSchemaHelper'

import { useImportAccounts } from './useAccountActions'
import { useContactsSelector } from './useContactSelector'
import { useAppDispatch } from './useRedux'
import { useCreateWallet } from './useWalletActions'

import { contactReducerActions } from '@/store/reducers/contact'
import type {
  TUseImportNep6Account,
  TUseImportNep6DecryptedAccount,
  TUseNeonMigrateContacts,
  TUseNeonMigrateData,
  TUseNeonMigrateGeneratedData,
} from '@/types/hooks'
import type { TContact, TContactAddress } from '@/types/store'

export const useNeonMigrateFile = () => {
  const { t: tCommonWallet } = useTranslation('common', { keyPrefix: 'wallet' })
  const dispatch = useAppDispatch()
  const { contactsRef } = useContactsSelector()
  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const validateAndParseFile = (fileContent: string): TUseNeonMigrateData | undefined => {
    try {
      const parsedContent = JSON.parse(fileContent)
      const validatedContent = ValidationSchemaHelper.parseNeonMigrate(parsedContent)

      const accounts = Nep6Helper.transformAccounts(validatedContent.accounts)

      if (accounts.length === 0) return undefined

      const blockchainServices = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

      const contacts = validatedContent.contacts.map<TUseNeonMigrateContacts>(contact => {
        const addresses: TUseNeonMigrateContacts['addresses'] = []

        contact.addresses?.forEach(address => {
          for (const service of blockchainServices) {
            if (
              (hasNameService(service) && service.validateNameServiceDomainFormat(address)) ||
              service.validateAddress(address)
            ) {
              addresses.push({ address, blockchain: service.name })
              return
            }
          }
        })

        return { name: contact.name || tCommonWallet('migratedContactName'), addresses }
      })

      return { content: { accounts, contacts }, type: 'migrate' }
    } catch {
      return undefined
    }
  }

  const handleTryDecryptAccount = (account: TUseImportNep6Account, password: string) =>
    Nep6Helper.decryptAccount(account, password)

  const handleGenerateData = (
    content: TUseNeonMigrateData['content'],
    decryptedAccounts: TUseImportNep6DecryptedAccount[]
  ): TUseNeonMigrateGeneratedData => {
    const contactsToCreate: TContact[] = []
    const accountsToCreate: TUseNeonMigrateGeneratedData['accountsToCreate'] = []

    decryptedAccounts.forEach(({ address, blockchain, decryptedKey, label }) => {
      accountsToCreate.push({ address, blockchain, key: decryptedKey, type: 'standard', name: label })
    })

    content.contacts?.forEach(({ name, addresses }) => {
      const contactAddresses: TContactAddress[] = []
      const foundContact = contactsRef.current.find(contact => name === contact.name)

      addresses.forEach(({ address, blockchain }) => {
        if (foundContact?.addresses?.some(contact => contact.address === address)) return

        contactAddresses.push({ address, blockchain })
      })

      if (!contactAddresses.length) return

      contactsToCreate.push({ name, id: UtilsHelper.uuid(), addresses: contactAddresses })
    })

    return {
      walletToCreate: { name: tCommonWallet('migratedWalletName'), type: 'non-standard', backupStatus: 'successful' },
      accountsToCreate,
      contactsToCreate,
    }
  }

  const handleImportBackupData = async (data: TUseNeonMigrateGeneratedData) => {
    data.contactsToCreate.forEach(contact => {
      dispatch(contactReducerActions.saveContact(contact))
    })

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
