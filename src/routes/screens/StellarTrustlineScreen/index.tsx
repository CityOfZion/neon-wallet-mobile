import { useMemo } from 'react'

import type { TTrustlineServiceStellarGetTrustlinesResponse } from '@cityofzion/bs-stellar'
import { useTranslation } from 'react-i18next'
import { FlatList, type ListRenderItem, Text, View } from 'react-native'

import AccountSubTitle from '@/components/AccountSubTitle'
import { PressableScale } from '@/components/PressableScale'
import { RefreshControl } from '@/components/RefreshControl'
import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { useStellarTrustlinesQuery } from '@/hooks/useStellarTruslines'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'

type TItem = {
  trustline: TTrustlineServiceStellarGetTrustlinesResponse
  onPress?: (token: TTrustlineServiceStellarGetTrustlinesResponse) => void
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <PressableScale
      className="min-h-16 flex-row items-center gap-5 p-2.5"
      onPress={item.onPress ? () => item.onPress?.(item.trustline) : undefined}
      disabled={!item.onPress}
      opacity={1}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <TwTokenIcon {...item.trustline.token} blockchain="stellar" width={20} height={20} />

        <Text className="font-sans-regular text-lg uppercase text-white" numberOfLines={1}>
          {item.trustline.token.symbol}
        </Text>
      </View>

      <Text className="text-right font-sans-regular text-sm text-gray-300" numberOfLines={1} ellipsizeMode="tail">
        {item.trustline.limit}
      </Text>

      <MdChevronRight aria-hidden className="text-gray-300" />
    </PressableScale>
  )
}

export const StellarTrustlineScreen = ({ navigation, route }: TWalletsStackScreenProps<'StellarTrustlineScreen'>) => {
  const { stellarAccount } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'stellarTrustline' })
  const trustlinesQuery = useStellarTrustlinesQuery(stellarAccount)

  const data = useMemo(() => {
    if (trustlinesQuery.isLoading || !trustlinesQuery.data) return []

    return trustlinesQuery.data.map(trustline => ({
      trustline,
      onPress: () => {
        navigation.navigate('StellarPersistTrustlineModal', {
          limit: trustline.limit,
          token: trustline.token,
          stellarAccount,
        })
      },
    }))
  }, [navigation, stellarAccount, trustlinesQuery.data, trustlinesQuery.isLoading])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent>
        <AccountSubTitle account={stellarAccount} className="mb-5" />

        <Skeleton.Root loading={trustlinesQuery.isLoading} className="w-full flex-1">
          <Skeleton.Group>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton.Item key={`trustline-skeleton-${index}`} className="h-12 w-full rounded-md" />
            ))}
          </Skeleton.Group>

          <Skeleton.Content className="size-full">
            <FlatList
              className="w-full"
              refreshControl={
                <RefreshControl refreshing={trustlinesQuery.isRefetching} onRefresh={trustlinesQuery.refetch} />
              }
              ListEmptyComponent={
                !trustlinesQuery.isLoading ? (
                  <Text className="my-8 text-center font-sans-regular text-lg text-white">{t('emptyList')}</Text>
                ) : undefined
              }
              ItemSeparatorComponent={() => <TwSeparator withoutContainer />}
              data={data}
              renderItem={renderItem}
            />

            <TwButton
              className="mb-4 mt-8"
              label={t('addTrustlineButtonLabel')}
              variant="contained-light"
              onPress={() => {
                navigation.navigate('StellarPersistTrustlineModal', { stellarAccount })
              }}
            />
          </Skeleton.Content>
        </Skeleton.Root>
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}
