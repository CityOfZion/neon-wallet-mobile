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
import { useLastIndexesByWallet } from '@/hooks/useUtilitySelector'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TUseImportAccountsParams } from '@/types/hooks'
import type { TRootStackScreenProps } from '@/types/stacks'

export const ImportMnemonicSelectionModal = ({ route }: TRootStackScreenProps<'ImportMnemonicSelectionModal'>) => {
  const { mnemonic, onConfirm } = route.params

  const { accountsRef } = useAccountsSelector()
  const { t } = useTranslation('modals', { keyPrefix: 'importMnemonicSelection' })
  const { t: commonT } = useTranslation('common')
  const { lastIndexesByWallet } = useLastIndexesByWallet()
  const { createWallet } = useCreateWallet()
  const { importAccounts } = useImportAccounts()

  const [generatedAccounts, setGeneratedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])

  const [isImporting, startImport] = usePressOnce(async () => {
    const wallet = await createWallet({
      name: commonT('wallet.mnemonicWalletName'),
      type: 'standard',
      mnemonic,
      backupStatus: 'successful',
    })

    const accountsToImport: TUseImportAccountsParams['accountsToImport'] = selectedAccounts.map(account => ({
      address: account.address,
      blockchain: account.blockchain,
      type: 'standard',
      key: account.key,
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
      const generatedAccounts = await BlockchainServiceHelper.bsAggregator.generateAccountsFromMnemonic(
        mnemonic,
        lastIndexesByWallet
      )

      const generatedAccountsArray = Array.from(generatedAccounts.entries()).flatMap(([, accounts]) => accounts)
      setGeneratedAccounts(generatedAccountsArray)

      const selectedAccounts = generatedAccountsArray.filter(
        account => !accountsRef.current.some(AccountHelper.predicate(account))
      )

      setSelectedAccounts(selectedAccounts)
    },
    [],
    1000
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
