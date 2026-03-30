import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { StepMenuButton } from '@/components/StepMenuButton'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useFileSystem } from '@/hooks/useFileSystem'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdLooksOne from '@/assets/images/md-looks-one.svg'
import MdLooksTwo from '@/assets/images/md-looks-two.svg'

import { ExportFullTransactionsSuccessModalContent } from './ExportFullTransactionsSuccessModalContent'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

type TActionData = {
  selectedAccount?: TAccount
  dateFrom?: Date
  dateTo?: Date
}

export const ExportFullTransactionsModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'ExportFullTransactionsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportFullTransactionsModal' })
  const { language } = useLanguageSelector()
  const { writeFile } = useFileSystem()

  const {
    actionData: { selectedAccount, dateFrom, dateTo },
    actionState,
    handleAct,
    setData,
  } = useActions<TActionData>({ selectedAccount: route.params?.account })

  const formattedDateFrom = dateFrom ? DateHelper.formatLocalized(dateFrom, { format: 'LLL do', language }) : undefined
  const formattedDateTo = dateTo ? DateHelper.formatLocalized(dateTo, { format: 'LLL do', language }) : undefined

  const service = selectedAccount
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[selectedAccount.blockchain]
    : undefined

  const isDisabled =
    !selectedAccount ||
    !dateFrom ||
    !dateTo ||
    !formattedDateFrom ||
    !formattedDateTo ||
    !service ||
    !hasFullTransactions(service)

  const handleAccountSelectionPress = () => {
    navigation.navigate('AccountSelectionModal', {
      onSelect: account => setData({ selectedAccount: account }),
      title: t('accountSelectionModalTitle'),
    })
  }

  const handleTimePeriodSelectionPress = () => {
    navigation.navigate('DateSelectionModal', {
      onSelect: (dateFrom, dateTo) => {
        setData({ dateFrom, dateTo })
      },
      title: t('dateSelectionModalTitle'),
      description: t('dateSelectionModalDescription'),
      dateFrom,
      dateTo,
    })
  }

  const handleExport = async () => {
    try {
      if (isDisabled) return

      const result = await service.fullTransactionsDataService.exportFullTransactionsByAddress({
        address: selectedAccount.address,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      })

      const format = 'yyyyMMdd'

      const localizedFileDateFrom = DateHelper.formatLocalized(dateFrom, {
        language,
        format,
      })

      const localizedFileDateTo = DateHelper.formatLocalized(dateTo, {
        language,
        format,
      })

      const filename = `NWM-transactions-${selectedAccount.address}-${selectedAccount.blockchain}-${localizedFileDateFrom}-${localizedFileDateTo}`

      await writeFile(filename, result, 'text/csv')

      navigation.navigate('SuccessModal', {
        title: t('successModal.title'),
        content: (
          <ExportFullTransactionsSuccessModalContent
            account={selectedAccount}
            formattedDateFrom={DateHelper.formatLocalized(dateFrom, { format: 'PPPp', language })}
            formattedDateTo={DateHelper.formatLocalized(dateTo, { format: 'PPPp', language })}
          />
        ),
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'ExportFullTransactionsModal', operation: 'handleExport' })
      ToastHelper.error({ message: AppError.wrap(error, t('errorMessage')).message })
    }
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      <Text className="text-center font-sans-regular text-lg text-white">{t('description')}</Text>

      <TwSeparator className="mt-6" />

      <Text className="mt-9 font-sans-regular text-sm uppercase text-gray-100">{t('formLabel')}</Text>

      <StepMenuButton
        active={!selectedAccount}
        value={selectedAccount?.address}
        leftElement={<MdLooksOne aria-hidden />}
        label={t('accountLabel')}
        onPress={handleAccountSelectionPress}
      />

      <TwSeparator />

      <StepMenuButton
        value={
          formattedDateFrom && formattedDateTo
            ? t('timePeriodValue', { from: formattedDateFrom, to: formattedDateTo })
            : undefined
        }
        active={!!selectedAccount}
        leftElement={<MdLooksTwo aria-hidden />}
        label={t('timePeriodLabel')}
        onPress={handleTimePeriodSelectionPress}
      />

      <TwButton
        label={t('exportButtonLabel')}
        variant="contained-light"
        className="mt-auto"
        disabled={isDisabled}
        isLoading={actionState.isActing}
        onPress={handleAct(handleExport)}
      />
    </TwModalLayout>
  )
}
