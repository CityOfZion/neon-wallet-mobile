import React, { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { TAccountSelectionAccordionAccount } from '@/components/AccountSelectionAccordion'
import { AccountSelectionAccordion } from '@/components/AccountSelectionAccordion'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'

import { AccountHelper } from '@/helpers/AccountHelper'
import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useImportAccounts } from '@/hooks/useAccountActions'
import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useMount } from '@/hooks/useMount'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TUseImportAccountsParams } from '@/types/hooks'
import type { TRootStackScreenProps } from '@/types/stacks'

export const ImportKeySelectionModal = ({ route }: TRootStackScreenProps<'ImportKeySelectionModal'>) => {
  const { key, onConfirm } = route.params

  const { accountsRef } = useAccountsSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'importMnemonicSelection' })
  const { t: commonT } = useTranslation('common')

  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const [generatedAccounts, setGeneratedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])

  const [isImporting, startImport] = usePressOnce(async () => {
    const wallet = await createWallet({
      name: commonT('wallet.importedName'),
      backupStatus: 'successful',
      type: 'non-standard',
    })

    const accountsToImport: TUseImportAccountsParams['accountsToImport'] = selectedAccounts.map(account => ({
      ...account,
      type: 'standard',
    }))

    await importAccounts({ wallet, accountsToImport })

    AnalyticsHelper.logEvent('wallet_imported')

    onConfirm()
  })

  const handleSelectAccount = (account: TAccountSelectionAccordionAccount) => {
    setSelectedAccounts(prev => {
      const findIndex = prev.findIndex(AccountHelper.predicate(account))
      if (findIndex === -1) {
        return [...prev, account]
      }

      prev.splice(findIndex, 1)

      return [...prev]
    })
  }

  const { isMounting } = useMount(
    async () => {
      const generatedAccounts: TAccountSelectionAccordionAccount[] = []

      const promises = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).map(
        async service => {
          if (!service.validateKey(key)) return

          const account = await service.generateAccountFromKey(key)
          generatedAccounts.push({ ...account, blockchain: service.name })
        }
      )

      await Promise.allSettled(promises)

      setGeneratedAccounts(generatedAccounts)

      const selectedAccounts = generatedAccounts.filter(
        account => !accountsRef.current.some(AccountHelper.predicate(account))
      )

      setSelectedAccounts(selectedAccounts)
    },
    [],
    500
  )

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton />}
      contentContainerClassName="justify-between"
    >
      {isMounting ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <View>
            <Text className="my-8 px-6 text-center font-sans-regular text-lg text-white">
              {t('foundAccountsMnemonicLabel')}
            </Text>

            <AccountSelectionAccordion
              selectedAccounts={selectedAccounts}
              accounts={generatedAccounts}
              onPressAccount={handleSelectAccount}
            />
          </View>

          <TwButton
            variant="contained-light"
            className="my-4"
            label={t('buttonLabel')}
            isLoading={isImporting}
            disabled={selectedAccounts.length === 0}
            onPress={startImport}
          />
        </Fragment>
      )}
    </TwModalLayout>
  )
}
