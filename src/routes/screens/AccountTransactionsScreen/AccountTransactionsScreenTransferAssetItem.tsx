import React from 'react'

import type { TTransactionTransferAsset } from '@cityofzion/blockchain-service'
import { Text, View } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
  transfer: TTransactionTransferAsset
}

export const AccountTransactionsScreenTransferAssetItem = ({ account, transfer }: TProps) => {
  const { currency } = useCurrencySelector()

  const exchange = useExchange([{ blockchain: account.blockchain, tokens: transfer.token ? [transfer.token] : [] }])

  let fiatAmount = 0

  if (transfer.token) {
    const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(
      transfer.token.hash,
      account.blockchain,
      exchange.data
    )

    fiatAmount = convertedPrice * Number(transfer.amount)
  }

  const fiatAmountFormatted = CurrencyHelper.format(fiatAmount, { currency })

  return (
    <View className="mt-4 flex-row items-center gap-2.5">
      {transfer.token ? (
        <TwTokenIcon width={16} height={16} {...transfer.token} blockchain={account.blockchain} className="rounded" />
      ) : (
        <View className="h-5 w-5" />
      )}

      <Text className="w-14 font-sans-regular text-lg text-white" numberOfLines={1} ellipsizeMode="middle">
        {transfer.token?.symbol ?? transfer.contractHash}
      </Text>

      <Text className="flex-1 font-sans-regular text-lg text-gray-100" numberOfLines={1}>
        {transfer.amount}
      </Text>

      <TwSkeleton isLoading={exchange.isLoading} layout={{ width: 56, height: 24 }}>
        <Text className="max-w-28 text-right font-sans-regular text-lg text-white" numberOfLines={1}>
          {fiatAmountFormatted}
        </Text>
      </TwSkeleton>
    </View>
  )
}
