import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { TAccountSelectionAccordionAccount } from '@/components/AccountSelectionAccordion'
import { AccountSelectionAccordion } from '@/components/AccountSelectionAccordion'
import { TwButton } from '@/components/TwButton'

import { AccountHelper } from '@/helpers/AccountHelper'

import { useAccountsSelector } from '@/hooks/useAccountSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const Nep6BackupImportAccountSelectionModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'Nep6BackupImportAccountSelectionModal'>) => {
  const { content, onSuccess } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'nep6BackupImportAccountSelection' })
  const { t: tCommon } = useTranslation('common')
  const { accountsRef } = useAccountsSelector()

  const availableAccounts = content.accounts.filter(
    account => !accountsRef.current.some(AccountHelper.predicate(account))
  )

  const [selectedAccounts, setSelectedAccounts] = useState<TAccountSelectionAccordionAccount[]>([])

  const handleSelectAccount = (account: TAccountSelectionAccordionAccount) => {
    setSelectedAccounts(previousData => {
      if (!previousData.some(AccountHelper.predicate(account))) {
        return [...previousData, account]
      }

      return previousData.filter(AccountHelper.predicateNot(account))
    })
  }

  const handleNext = () => {
    const accounts = content.accounts.filter(account => selectedAccounts.some(AccountHelper.predicate(account)))

    navigation.navigate('Nep6BackupImportPasswordModal', { accounts, onSuccess })
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="justify-between">
        <View>
          <Text className="my-8 px-6 text-center font-sans-regular text-lg text-white">
            {availableAccounts.length === 0
              ? t('noSelectableAccounts', { count: content.accounts.length })
              : t('selectLabel', { count: availableAccounts.length })}
          </Text>

          <AccountSelectionAccordion
            selectedAccounts={selectedAccounts}
            accounts={content.accounts}
            onPressAccount={handleSelectAccount}
            onToggleAll={setSelectedAccounts}
          />
        </View>

        {availableAccounts.length > 0 ? (
          <TwButton
            variant="contained-light"
            className="mb-4 mt-8"
            label={tCommon('general.next')}
            rightElement={<TbArrowRight aria-hidden />}
            disabled={selectedAccounts.length === 0}
            onPress={handleNext}
          />
        ) : (
          <TwButton
            variant="text"
            className="mb-4 mt-8"
            label={tCommon('general.cancel')}
            onPress={navigation.goBack}
          />
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
