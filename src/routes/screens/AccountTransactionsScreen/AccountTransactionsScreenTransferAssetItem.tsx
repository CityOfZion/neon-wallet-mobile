import React from 'react'

import { BSBigNumberHelper, type TTransactionTokenEvent } from '@cityofzion/blockchain-service'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
  event: TTransactionTokenEvent
}

export const AccountTransactionsScreenTransferAssetItem = ({ account, event }: TProps) => {
  const { currency } = useCurrencySelector()

  const exchange = useExchange([{ blockchain: account.blockchain, tokens: event.token ? [event.token] : [] }])

  let fiatAmount = 0

  if (event.token) {
    const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(event.token.hash, account.blockchain, exchange.data)
    fiatAmount = BSBigNumberHelper.fromNumber(convertedPrice)
      .multipliedBy(event.amount ?? 0)
      .toNumber()
  }

  const fiatAmountFormatted = CurrencyHelper.format(fiatAmount, { currency })

  return (
    <View className="mt-4 flex-row items-center gap-2.5">
      {event.token ? (
        <TwTokenIcon width={20} height={20} {...event.token} blockchain={account.blockchain} className="rounded" />
      ) : (
        <View className="h-5 w-5" />
      )}

      <Text className="w-14 font-sans-regular text-lg text-white" numberOfLines={1} ellipsizeMode="middle">
        {event.token?.symbol ?? event.contractHash}
      </Text>

      <Text className="flex-1 font-sans-regular text-lg text-gray-100" numberOfLines={1}>
        {event.amount}
      </Text>

      <Skeleton.Root loading={exchange.isLoading}>
        <Skeleton.Group>
          <Skeleton.Item className="h-6 w-14" />
        </Skeleton.Group>

        <Skeleton.Content>
          <Text className="max-w-28 text-right font-sans-regular text-lg text-white" numberOfLines={1}>
            {fiatAmountFormatted}
          </Text>
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
