import React, { useMemo } from 'react'

import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { StyleHelper } from '@/helpers/StyleHelper'
import { TokenHelper } from '@/helpers/TokenHelper'

import { useBalances } from '@/hooks/useBalances'

import { TwSkeleton } from '../TwSkeleton'

import type { IAccountState } from '@/types/store'

type TProps = {
  accounts: IAccountState[]
}

const MIN_WEIGHT = 5
const MAX_WEIGHT = 100

export const WalletCardBalanceBar = React.memo(({ accounts }: TProps) => {
  const balances = useBalances(accounts)

  const bars = useMemo(() => {
    if (!balances.data || balances.exchangeTotal <= 0) return

    const firstTenTokenBalancesConverted =
      balances.data
        ?.flatMap(balance => balance.tokensBalances)
        ?.sort((a, b) => b.exchangeAmount - a.exchangeAmount)
        ?.slice(0, 10) || []

    const totalTokensBalances = firstTenTokenBalancesConverted.reduce(
      (accumulator, balance) => accumulator + balance.exchangeAmount,
      0
    )

    return firstTenTokenBalancesConverted.map(tokenBalanceConverted => {
      const color = TokenHelper.generateTokenColor(tokenBalanceConverted.token.hash, tokenBalanceConverted.blockchain)
      const weight = Math.abs((tokenBalanceConverted.exchangeAmount * MAX_WEIGHT) / totalTokensBalances)

      if (weight < MIN_WEIGHT) {
        return { color, weight: MIN_WEIGHT }
      }

      return { color, weight }
    })
  }, [balances.data, balances.exchangeTotal])

  const loading = balances.isLoading || !bars

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={StyleHelper.mergeStyles(
        'absolute bottom-[40px] left-0 h-2.5 w-[232px] flex-row items-center overflow-hidden rounded-r-full',
        {
          'gap-1 bg-gray-700 px-1': !loading,
        }
      )}
    >
      <TwSkeleton isLoading={balances.isLoading} layout={{ width: '100%', height: '100%', radius: 'square' }}>
        {bars &&
          bars.map((bar, index) => (
            <View
              key={`wallet-card-bar-${index}`}
              className="h-1 flex-shrink basis-0 rounded-full"
              style={{ flexGrow: bar.weight, backgroundColor: bar.color }}
            />
          ))}
      </TwSkeleton>
    </Animated.View>
  )
})
