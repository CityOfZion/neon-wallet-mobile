import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbAdjustments from '@/assets/images/tb-adjustments.svg'
import TbFileExport from '@/assets/images/tb-file-export.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountTransactionsContextModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'AccountTransactionsContextModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountTransactionsContext' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const { account, dateFrom, dateTo, onDatesChange } = route.params
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const hasServiceFullTransactions = hasFullTransactions(service)

  const handleFilters = () => {
    if (!hasServiceFullTransactions) return

    navigation.replace('DateSelectionModal', {
      title: t('dateSelection.title'),
      description: t('dateSelection.description'),
      dateFrom,
      dateTo,
      onSelect: (dateFrom: Date, dateTo: Date) => onDatesChange(dateFrom, dateTo),
    })
  }

  const handleExport = () => {
    if (!hasServiceFullTransactions) return

    navigation.replace('ExportFullTransactionsModal', { account })
  }

  return (
    <ModalLayout.Root full={false}>
      <ModalLayout.Header />

      <ModalLayout.ScrollContent>
        <TwMenuButton
          label={t('filtersButtonLabel')}
          disabled={!hasServiceFullTransactions}
          leftElement={<TbAdjustments aria-hidden className="text-neon" />}
          onPress={handleFilters}
        />

        <TwSeparator />

        <TwMenuButton
          label={t('exportButtonLabel')}
          disabled={!hasServiceFullTransactions}
          leftElement={<TbFileExport aria-hidden className="text-neon" />}
          onPress={handleExport}
        />

        <TwButton variant="text" label={tCommonGeneral('cancel')} className="mt-6" onPress={navigation.goBack} />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
