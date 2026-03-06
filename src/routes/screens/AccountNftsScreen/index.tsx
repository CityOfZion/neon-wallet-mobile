import React, { useRef } from 'react'

import type { TNftResponse } from '@cityofzion/blockchain-service'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { FlatList, type LayoutChangeEvent, type ListRenderItem, Text, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { PressableScale } from '@/components/PressableScale'
import { RefreshControl } from '@/components/RefreshControl'
import { ScreenLoader } from '@/components/ScreenLoader'
import { Skeleton } from '@/components/Skeleton'

import { LinkHelper } from '@/helpers/LinkHelper'

import { useNftsQuery } from '@/hooks/useNftsQuery'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import DoraIcon from '@/assets/images/dora-icon.svg'

import { AccountNftsScreenNftImage } from './AccountNftsScreenNftImage'

import type { TWalletsStackScreenProps } from '@/types/stacks'

const renderItem: ListRenderItem<TNftResponse> = ({ item }) => {
  return (
    <PressableScale
      disabled={!item.explorerUri}
      onPress={LinkHelper.open.bind(null, item.explorerUri!)}
      className="flex-row items-center gap-4 rounded-lg bg-gray-800 p-3"
    >
      <AccountNftsScreenNftImage image={item.image} />

      <View className="flex-1">
        <View className="flex-row items-center gap-1">
          {item.collection?.image && (
            <Image contentFit="cover" source={{ uri: item.collection.image }} className="size-4 rounded-full" />
          )}

          {item.collection?.name && (
            <Text numberOfLines={1} ellipsizeMode="tail" className="max-w-28 font-sans-medium text-xs text-gray-300">
              {item.collection.name}
            </Text>
          )}

          <Text ellipsizeMode="middle" numberOfLines={1} className="max-w-16 font-sans-medium text-xs text-neon">
            #{item.hash}
          </Text>
        </View>

        <Text className="font-sans-bold text-lg capitalize text-white" numberOfLines={1}>
          {item.name}
        </Text>
      </View>

      {item.explorerUri && <DoraIcon aria-hidden className="size-6 text-neon" />}
    </PressableScale>
  )
}

export const AccountNftsSScreen = (props: TWalletsStackScreenProps<'AccountNftsScreen'>) => {
  const { account } = props.route.params
  const { t } = useTranslation('screens', { keyPrefix: 'accountNftsScreen' })
  const { aggregatedData, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage, refetch, isRefetching } =
    useNftsQuery(account)

  const onEndReachedCalledDuringMomentum = useRef(true)
  const listHeightRef = useRef(0)

  const handleEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current || isFetchingNextPage || isLoading || isRefetching) return

    onEndReachedCalledDuringMomentum.current = true

    fetchNextPage()
  }

  const handleMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    listHeightRef.current = event.nativeEvent.layout.height
  }

  const handleContentSizeChange = (_width: number, contentHeight: number) => {
    if (
      listHeightRef.current > 0 &&
      contentHeight < listHeightRef.current &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoading &&
      !isRefetching
    ) {
      fetchNextPage()
    }
  }

  return (
    <TwScreenLayout withoutScroll title={t('title')}>
      <AccountSubTitle account={account} />

      {isLoading ? (
        <ScreenLoader />
      ) : (
        <FlatList
          className="w-full"
          contentContainerClassName="mt-4 w-full gap-2"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          data={aggregatedData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading || isFetchingNextPage ? (
              <Skeleton.Root>
                <Skeleton.Group>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton.Item key={`transaction-skeleton-${index}`} className="h-16 w-full rounded-lg" />
                  ))}
                </Skeleton.Group>
              </Skeleton.Root>
            ) : undefined
          }
          ListEmptyComponent={<FlatListEmpty label={t('emptyList')} />}
          keyExtractor={(_, index) => `nft-item-${index}`}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
    </TwScreenLayout>
  )
}
