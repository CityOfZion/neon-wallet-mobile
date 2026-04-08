import { useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import type { FlatListProps, ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { TokenHelper } from '@/helpers/TokenHelper'

import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { PressableScale } from './PressableScale'
import { Skeleton } from './Skeleton'
import { TwSeparator } from './TwSeparator'
import { TwTokenIcon } from './TwTokenIcon'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TToken, TTokenBalance, TUseBalanceOptionShowType } from '@/types/query'
import type { TAccount } from '@/types/store'

type Props = {
  accounts: TAccount[]
  showType?: TUseBalanceOptionShowType
  onItemPress?: (token: TTokenBalance) => void
  onItemLongPress?: (token: TTokenBalance) => void
} & Omit<FlatListProps<TItem>, 'data' | 'renderItem' | 'keyExtractor'>

type TItem = TTokenBalance & {
  tokenColor: string
  blockchain: TBlockchainServiceKey
  formattedExchangeAmount: string
  onPress?: (token: TTokenBalance) => void
  onLongPress?: (token: TTokenBalance) => void
}

const { t } = I18nextHelper.get()

const getTokenKey = (token: TToken) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[token.blockchain]

  return `${service.tokenService.normalizeHash(token.hash)}-${token.blockchain}`
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <PressableScale
      className="flex-row gap-5 p-2.5"
      onPress={item.onPress ? () => item.onPress?.(item) : undefined}
      onLongPress={item.onLongPress ? () => item.onLongPress?.(item) : undefined}
      disabled={!item.onPress && !item.onLongPress}
      opacity={1}
    >
      <View className="flex-1 flex-row gap-4">
        <TwTokenIcon
          {...item.token}
          blockchain={item.token?.blockchain || item.blockchain}
          width={20}
          height={20}
          className="mt-1.5"
        />

        <View className="flex-shrink gap-1.5">
          <Text className="font-sans-regular text-lg uppercase text-white" numberOfLines={1}>
            {item.token.symbol}
          </Text>

          <Text className="flex-grow font-sans-regular text-sm uppercase text-gray-100" numberOfLines={1}>
            {t(`common:blockchainServices.${item.blockchain}.label`)}
          </Text>
        </View>
      </View>

      <View className="gap-1.5">
        <Text className="font-sans-regular text-xs leading-6 text-gray-300">
          {t('components:balanceList.holdings')}
        </Text>

        <Text className="text-left font-sans-regular text-xs leading-5 text-gray-300">
          {t('components:balanceList.value')}
        </Text>
      </View>

      <View className="flex-1 gap-1.5">
        <Text className="text-right font-sans-regular text-lg text-white" numberOfLines={1} ellipsizeMode="tail">
          {item.amount || '0'}
        </Text>

        <Text className="text-right font-sans-regular text-sm text-neon" numberOfLines={1} ellipsizeMode="tail">
          {item.formattedExchangeAmount}
        </Text>
      </View>
    </PressableScale>
  )
}

export const BalanceList = ({ onItemPress, onItemLongPress, accounts, className, showType, ...props }: Props) => {
  const { t } = useTranslation('components', { keyPrefix: 'balanceList' })
  const { currency } = useCurrencySelector()

  const balances = useBalances(accounts, { showType })

  const data = useMemo<TItem[]>(() => {
    if (balances.isLoading) return []

    const tokenBalancesMap: Map<string, TItem> = new Map()

    const allTokensBalances = balances.data.flatMap(balance => balance.tokensBalances)

    allTokensBalances.forEach(tokenBalance => {
      const tokenKey = getTokenKey(tokenBalance.token)

      let amountNumber = tokenBalance.amountNumber
      let exchangeAmountNumber = tokenBalance.exchangeAmount

      const existentTokenBalance = tokenBalancesMap.get(tokenKey)
      if (existentTokenBalance) {
        amountNumber += existentTokenBalance.amountNumber
        exchangeAmountNumber += existentTokenBalance.exchangeAmount
      }

      tokenBalancesMap.set(tokenKey, {
        blockchain: tokenBalance.blockchain,
        token: tokenBalance.token,
        amountNumber,
        amount: BSBigNumberHelper.format(amountNumber, { decimals: tokenBalance.token.decimals }),
        exchangeAmount: exchangeAmountNumber,
        onPress: onItemPress,
        onLongPress: onItemLongPress,
        exchangeConvertedPrice: tokenBalance.exchangeConvertedPrice,
        formattedExchangeAmount: CurrencyHelper.format(exchangeAmountNumber, { currency }),
        tokenColor: TokenHelper.generateTokenColor(tokenBalance.token.hash, tokenBalance.blockchain),
      })
    })

    return Array.from(tokenBalancesMap.values())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances.isLoading, balances.data, currency.label])

  return (
    <FlatList
      data={data}
      keyExtractor={item => getTokenKey(item.token)}
      className={StyleHelper.mergeStyles('w-full', className)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <TwSeparator withoutContainer />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        !balances.isLoading ? (
          <Text className="my-8 text-center font-sans-regular text-lg text-white">{t('empty')}</Text>
        ) : undefined
      }
      ListFooterComponent={
        <Skeleton.Root loading={balances.isLoading} className="mb-6">
          <Skeleton.Group>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton.Item key={`balance-skeleton-${index}`} className="h-12 w-full rounded-md" />
            ))}
          </Skeleton.Group>
        </Skeleton.Root>
      }
      {...props}
    />
  )
}
