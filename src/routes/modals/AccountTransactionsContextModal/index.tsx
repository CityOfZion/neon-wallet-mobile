import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbAdjustments from '@/assets/images/tb-adjustments.svg'
import TbFileExport from '@/assets/images/tb-file-export.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountTransactionsContextModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'AccountTransactionsContextModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountTransactionsContextModal' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })

  const { account, dateFrom, dateTo, onDatesChange } = route.params
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const hasServiceFullTransactions = hasFullTransactions(service)

  const handleFilters = () => {
    if (!hasServiceFullTransactions) return

    navigation.replace('DateSelectionModal', {
      title: t('dateSelectionModal.title'),
      description: t('dateSelectionModal.description'),
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
    <TwModalLayout full={false} withoutHeader>
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

      <TwButton variant="text" label={tCommon('cancel')} className="mt-6" onPress={navigation.goBack} />
    </TwModalLayout>
  )
}
