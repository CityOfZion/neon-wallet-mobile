import React from 'react'

import { BSBigHumanAmount, type TTransactionDefaultTokenEvent } from '@cityofzion/blockchain-service'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
  event: TTransactionDefaultTokenEvent
}

export const AccountTransactionsTransactionDefaultEventToken = ({ blockchain, event }: TProps) => {
  const { currency } = useCurrencySelector()

  const exchange = useExchange([{ blockchain, tokens: event.token ? [event.token] : [] }])

  let fiatAmount = 0

  if (event.token) {
    const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(event.token.hash, blockchain, exchange.data)
    fiatAmount = new BSBigHumanAmount(convertedPrice).multipliedBy(event.amount || 0).toNumber()
  }

  const fiatAmountFormatted = CurrencyHelper.format(fiatAmount, { currency })

  return (
    <View className="mt-2 flex-row items-center gap-2">
      {event.token && (
        <TwTokenIcon width={20} height={20} {...event.token} blockchain={blockchain} className="rounded" />
      )}

      {(event.token?.symbol || event.token?.name || event.token?.hash) && (
        <Text className="w-full max-w-14 font-sans-regular text-base text-white" numberOfLines={1}>
          {event.token.symbol || event.token.name || event.token.hash}
        </Text>
      )}

      <Text className="flex-1 font-sans-regular text-base text-gray-100" numberOfLines={1}>
        {event.amount}
      </Text>

      <Skeleton.Root loading={exchange.isLoading}>
        <Skeleton.Group>
          <Skeleton.Item className="h-5 w-14 bg-gray-800" />
        </Skeleton.Group>

        <Skeleton.Content>
          <Text className="max-w-28 text-right font-sans-regular text-base text-white" numberOfLines={1}>
            {fiatAmountFormatted}
          </Text>
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
