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
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TUseImportAccountsParams } from '@/types/hooks'
import type { TMoreStackScreenProps } from '@/types/stacks'

export const ImportKeySelectionScreen = ({ navigation, route }: TMoreStackScreenProps<'ImportKeySelectionScreen'>) => {
  const { key } = route.params

  const { accountsRef } = useAccountsSelector()
  const { t } = useTranslation('screens', { keyPrefix: 'importMnemonicSelectionScreen' })
  const { t: commonT } = useTranslation('common')

  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const [isImporting, setIsImporting] = useState(false)
  const [generatedAccounts, setGeneratedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])

  const handlePressImport = async () => {
    try {
      setIsImporting(true)

      const wallet = await createWallet({
        name: commonT('wallet.importedName'),
        backupStatus: 'successful',
        type: 'non-standard',
      })

      const accountsToImport: TUseImportAccountsParams['accounts'] = selectedAccounts.map(account => ({
        ...account,
        type: 'standard',
      }))

      await importAccounts({ wallet, accounts: accountsToImport })

      AnalyticsHelper.logEvent('wallet_imported')

      navigation.popToTop()
      navigation.jumpTo('WalletsStack', { screen: 'WalletsScreen', params: { wallet } })
    } finally {
      setIsImporting(false)
    }
  }

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

      Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
        if (!service.validateKey(key)) return

        const account = service.generateAccountFromKey(key)
        generatedAccounts.push({ ...account, blockchain: service.name })
      })

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
    <TwScreenLayout title={t('title')} contentContainerClassName="justify-between">
      {isMounting ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <View>
            <Text className="my-8 px-6 text-center font-sans-regular text-lg text-white">
              {t('foundAccountsMnemonic')}
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
            onPress={handlePressImport}
          />
        </Fragment>
      )}
    </TwScreenLayout>
  )
}
