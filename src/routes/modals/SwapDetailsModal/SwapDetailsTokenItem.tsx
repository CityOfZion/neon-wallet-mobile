import React from 'react'

import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  symbol: string
  amount: string
  blockchain?: TBlockchainServiceKey
  decimals?: number
}

export const SwapDetailsTokenItem = ({ symbol, amount, blockchain, decimals = 0 }: TProps) => {
  const { t: tCommon } = useTranslation('common')

  const formattedAmount = new BSBigHumanAmount(amount, decimals).toFormatted()

  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-row items-center gap-2">
        {blockchain && <TwBlockchainIcon blockchain={blockchain} className="size-4 text-gray-300" />}

        <Text className="font-sans-regular text-lg uppercase text-white">
          {symbol}
          {blockchain && (
            <Text className="font-sans-regular uppercase text-gray-100">
              {` | ${tCommon(`blockchainServices.${blockchain}.label`)}`}
            </Text>
          )}
        </Text>
      </View>

      <Text className="font-sans-regular text-lg text-white">{formattedAmount}</Text>
    </View>
  )
}
