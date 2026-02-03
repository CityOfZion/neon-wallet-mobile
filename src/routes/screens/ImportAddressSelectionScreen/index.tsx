import React, { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { TAccountSelectionAccordionAccount } from '@/components/AccountSelectionAccordion'
import { AccountSelectionAccordion } from '@/components/AccountSelectionAccordion'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useImportAccounts } from '@/hooks/useAccountActions'
import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useMount } from '@/hooks/useMount'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TUseImportAccountsParams } from '@/types/hooks'
import type { TMoreStackScreenProps } from '@/types/stacks'

export const ImportAddressSelectionScreen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'ImportAddressSelectionScreen'>) => {
  const { address } = route.params

  const { accountsRef } = useAccountsSelector()
  const { t } = useTranslation('screens', { keyPrefix: 'importMnemonicSelectionScreen' })
  const { t: tCommon } = useTranslation('common')

  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const [generatedAccounts, setGeneratedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])

  const [isImporting, startImport] = usePressOnce(async () => {
    const wallet = await createWallet({
      name: tCommon('wallet.watchAccount'),
      type: 'non-standard',
      backupStatus: 'successful',
    })

    const accountsToImport: TUseImportAccountsParams['accounts'] = selectedAccounts.map(account => ({
      ...account,
      type: 'watch',
    }))

    await importAccounts({ wallet, accounts: accountsToImport })

    navigation.popToTop()
    navigation.jumpTo('WalletsStack', { screen: 'WalletsScreen', params: { wallet } })
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

      Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
        if (!service.validateAddress(address)) return
        generatedAccounts.push({ address, blockchain: service.name })
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
            onPress={startImport}
          />
        </Fragment>
      )}
    </TwScreenLayout>
  )
}
