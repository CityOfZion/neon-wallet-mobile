import React, { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Pressable, Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TokenSelectionTokenIcon } from '@/components/TokenSelectionTokenIcon'
import { TwInput } from '@/components/TwInput'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useBalance } from '@/hooks/useBalances'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TTokenSelectionModalToken } from '@/types/modals'
import type { TRootStackScreenProps } from '@/types/stacks'

type TItem = TTokenSelectionModalToken & {
  hideBalance: boolean
  isSelected: boolean
  onPress(): void
}

const renderItem: ListRenderItem<TItem> = ({ item, index }) => {
  const network = item.network || item.blockchain
  const odd = index % 2 === 0

  return (
    <Pressable
      onPress={item.onPress}
      className={StyleHelper.mergeStyles(
        'h-[52px] flex-row items-center justify-between gap-x-2 border-l-4 border-transparent pl-3 pr-4',
        {
          'bg-gray-300/15': !odd,
          'border-neon bg-gray-900/50': item.isSelected,
        }
      )}
    >
      <View className="flex-row items-center">
        <TokenSelectionTokenIcon token={item} />

        <Text className="ml-2.5 font-sans-medium text-lg uppercase text-white">{item.symbol}</Text>

        {network && <Text className="font-sans-regular text-lg uppercase text-gray-100"> | {network}</Text>}
      </View>

      {!item.hideBalance && (
        <Text
          className="flex-shrink text-right font-sans-regular text-lg text-white"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.amount || '0.00'}
        </Text>
      )}
    </Pressable>
  )
}

export const TokenSelectionModal = ({ navigation, route }: TRootStackScreenProps<'TokenSelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'tokenSelection' })
  const { onSelect, tokens, account, blockchain, title, selectedToken } = route.params
  const hideBalance = !account
  const balance = useBalance(hideBalance ? undefined : account)
  const isLoading = !hideBalance && balance.isLoading

  const [filter, setFilter] = useState('')

  const filteredAndSortedTokens = useMemo<TItem[]>(() => {
    const filtered: TItem[] = []

    tokens.forEach(token => {
      if (blockchain && token.blockchain !== blockchain) return

      const item = {
        ...token,
        hideBalance,
        isSelected: selectedToken
          ? `${token.symbol}:${token.network}` === `${selectedToken.symbol}:${selectedToken.network}`
          : false,
        onPress: () => {
          onSelect(token)
          navigation.goBack()
        },
      }

      const hash = token.hash
      if (!hideBalance && balance.data && hash) {
        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[token.blockchain!]

        const tokenBalance = balance.data.tokensBalances?.find(tokenBalance =>
          service.tokenService.predicateByHash(hash, tokenBalance.token)
        )

        item.amount = tokenBalance?.amount
      }

      filtered.push(item)
    })

    filtered.sort((a, b) => NumberHelper.number(a.amount || 0) - NumberHelper.number(b.amount || 0))

    return filtered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, balance, blockchain, navigation])

  const filteredTokensByText = useMemo(() => {
    let filtered = [...filteredAndSortedTokens]
    const newFilter = filter.toLowerCase().trim()

    if (newFilter)
      filtered = filteredAndSortedTokens.filter(token => token.symbol.toLowerCase().trim().includes(newFilter))

    return filtered
  }, [filter, filteredAndSortedTokens])

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">{title || t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      <ModalLayout.ViewContent>
        <TwInput
          className="placeholder:text-neon"
          placeholder={t('inputPlaceholder')}
          containerProps={{
            className: 'mt-4 mx-4.5',
          }}
          value={filter}
          disabled={isLoading || filteredAndSortedTokens.length === 0}
          onChangeText={setFilter}
          clearable
          autoCapitalize="none"
        />

        <Skeleton.Root loading={isLoading} className="mt-8 flex-shrink">
          <Skeleton.Group>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton.Item key={`token-skeleton-${index}`} className="h-12 w-full rounded-md" />
            ))}
          </Skeleton.Group>

          <Skeleton.Content>
            <FlatList
              className="w-full"
              data={filteredTokensByText}
              keyExtractor={(item, index) => `${item.symbol}-${index}`}
              renderItem={renderItem}
              getItemLayout={(_data, index) => ({ length: 52, offset: 52 * index, index })}
              removeClippedSubviews
              initialNumToRender={15}
              showsVerticalScrollIndicator={false}
              windowSize={11}
              ListHeaderComponent={
                filteredTokensByText.length > 0 ? (
                  <View className="mb-1 flex-row justify-between px-4.5">
                    <Text className="font-sans-bold text-sm text-gray-300">{t('tokenLabel')}</Text>
                    {!hideBalance && <Text className="font-sans-bold text-sm text-gray-300">{t('balanceLabel')}</Text>}
                  </View>
                ) : undefined
              }
              ListEmptyComponent={
                <Text className="mt-5 text-center font-sans-medium text-lg text-white">{t('emptyList')}</Text>
              }
            />
          </Skeleton.Content>
        </Skeleton.Root>
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
