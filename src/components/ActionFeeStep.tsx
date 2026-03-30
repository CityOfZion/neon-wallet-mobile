import type { IBlockchainService } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Loader } from '@/components/Loader'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbReceipt from '@/assets/images/tb-receipt.svg'

import { ActionStep } from './ActionStep'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  title: string
  feePlaceholder: string
  isCalculatingFee: boolean
  fee?: string
  service?: IBlockchainService<TBlockchainServiceKey>
  className?: string
  iconClassName?: string
}

export const ActionFeeStep = ({
  title,
  feePlaceholder,
  isCalculatingFee,
  fee,
  service,
  className,
  iconClassName,
}: TProps) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const { currency } = useCurrencySelector()
  const exchange = useExchange(service ? [{ blockchain: service.name, tokens: [service.feeToken] }] : [])

  const convertedFeeTokenPrice =
    exchange && service
      ? ExchangeHelper.getExchangeConvertedPrice(service.feeToken.hash, service.name, exchange.data)
      : 0

  const fiatFee = NumberHelper.number(fee || 0) * convertedFeeTokenPrice

  return (
    <View className={StyleHelper.mergeStyles('mt-3 rounded bg-gray-700/60 px-1 py-2', className)}>
      <ActionStep
        leftElement={<TbReceipt aria-hidden className={StyleHelper.mergeStyles('text-blue', iconClassName)} />}
        title={title}
        className="gap-x-2"
      >
        {isCalculatingFee ? (
          <Loader />
        ) : (
          <Text className="max-w-[60%] font-sans-regular text-lg text-white" numberOfLines={1} ellipsizeMode="middle">
            {fee || feePlaceholder}
          </Text>
        )}
      </ActionStep>

      <View className="flex-row justify-between px-2 pb-4">
        <Text className="ml-8 font-sans-regular text-lg text-gray-100">
          {CurrencyHelper.format(fiatFee, { currency })}
        </Text>

        {service && !isCalculatingFee && fee && (
          <View className="flex-row">
            <Text className="font-sans-regular text-lg text-white">{service.feeToken.symbol}</Text>
            <Text className="font-sans-regular text-lg text-gray-100">{` | ${tCommon(`${service.name}.id`)}`}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
