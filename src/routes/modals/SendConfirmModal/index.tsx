import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useExchange } from '@/hooks/useExchanges'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheck from '@/assets/images/tb-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import { SendConfirmTransactionDetailItem } from './SendConfirmTransactionDetailItem'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SendConfirmModal = ({ navigation, route }: TRootStackScreenProps<'SendConfirmModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sendConfirmModal' })
  const { currency } = useCurrencySelector()
  const { recipients, onConfirm, fee, service } = route.params

  const [isLoading, handleSubmit] = usePressOnce(async () => {
    await onConfirm(navigation)
  })

  const exchange = useExchange(service ? [{ blockchain: service.name, tokens: [service.feeToken] }] : [])

  const convertedFeeTokenPrice =
    exchange && service
      ? ExchangeHelper.getExchangeConvertedPrice(service.feeToken.hash, service.name, exchange.data)
      : 0

  const fiatFee = BSBigNumberHelper.fromNumber(fee ?? 0)
    .multipliedBy(convertedFeeTokenPrice)
    .toNumber()

  return (
    <TwModalLayout title={t('title')} titleClassName="text-1xl" rightElement={<TwModalLayoutCloseIconButton />}>
      <Text className="mb-6 mt-1 text-left font-sans-regular text-base leading-5 text-white">{t('description')}</Text>

      <View className="mb-3 flex flex-col rounded bg-asphalt p-3">
        <View className="flex flex-row items-center gap-x-2 pb-3">
          <TbReceipt aria-hidden className="size-6 text-blue" />
          <Text className="font-sans-medium text-base text-white">{t('detailsLabel')}</Text>
        </View>

        {recipients.map((transaction, index) => (
          <SendConfirmTransactionDetailItem
            key={`transaction-detail-item-${index}`}
            transaction={transaction}
            order={index + 1}
          />
        ))}
      </View>

      <View className="mb-8 flex flex-col gap-y-2 rounded bg-asphalt p-3">
        <View className="flex flex-row justify-between gap-x-2">
          <Text className="font-sans-medium text-base text-blue">{t('totalFeeLabel')}</Text>
          <Text className="font-sans-regular text-sm text-gray-100">
            <Text>{CurrencyHelper.format(fiatFee, { currency })}</Text>
          </Text>
        </View>

        <View className="flex flex-row justify-between gap-x-2">
          <Text className="font-sans-regular text-base text-white">{service.feeToken.symbol}</Text>
          <Text className="font-sans-regular text-base text-white">{fee}</Text>
        </View>
      </View>

      <TwButton
        label={t('confirmButtonLabel')}
        className="mb-4 mt-auto"
        variant="contained-light"
        leftElement={<TbCheck aria-hidden />}
        onPress={handleSubmit}
        isLoading={isLoading}
      />
    </TwModalLayout>
  )
}
