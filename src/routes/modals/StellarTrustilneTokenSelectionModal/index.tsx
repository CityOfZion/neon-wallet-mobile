import { useCallback, useMemo } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import { FlatList, Keyboard, type ListRenderItem, Text } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { Skeleton } from '@/components/Skeleton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'
import { TwTokenIcon } from '@/components/TwTokenIcon'

import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useActions } from '@/hooks/useActions'
import { useLazyStellarGetTrustlineTokens } from '@/hooks/useStellarTruslines'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

type TItem = {
  token: TBSToken
  onPress?: (token: TBSToken) => void
}

type TActionsData = {
  filter: string
  tokens: TBSToken[]
  loading: boolean
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <PressableScale
      className="min-h-16 flex-row items-center gap-2.5 p-2.5"
      onPress={item.onPress ? () => item.onPress?.(item.token) : undefined}
      disabled={!item.onPress}
      opacity={1}
    >
      <TwTokenIcon {...item.token} blockchain="stellar" width={24} height={24} />

      <Text className="font-sans-regular text-lg uppercase text-white" numberOfLines={1}>
        {item.token.symbol}
      </Text>

      <Text
        className="w-1/2 flex-shrink font-sans-regular text-lg uppercase text-gray-300"
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {item.token.hash}
      </Text>
    </PressableScale>
  )
}

export const StellarTrustilneTokenSelectionModal = ({
  route,
  navigation,
}: TRootStackScreenProps<'StellarTrustilneTokenSelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'stellarTrustilneTokenSelection' })
  const { getTrustlinesTokens } = useLazyStellarGetTrustlineTokens()

  const { actionData, actionState, setData } = useActions<TActionsData>({
    filter: '',
    tokens: [],
    loading: false,
  })

  const data = useMemo(() => {
    return actionData.tokens.map<TItem>(token => ({
      token,
      onPress: token => {
        route.params.onSelect(token)
        navigation.goBack()
      },
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.tokens])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchChange = useCallback(
    debounce(async (text: string) => {
      try {
        Keyboard.dismiss()
        const tokens = await getTrustlinesTokens(text)
        setData({ tokens })
      } catch (error) {
        LoggerHelper.error(error, { where: 'SearchableTokenSelect', operation: 'getTrustlinesTokens' })
      } finally {
        setData({ loading: false })
      }
    }, 1500),
    []
  )

  const handleValueChange = (filter: string) => {
    const shouldSearch = !!filter.length

    setData(data => ({ filter, loading: shouldSearch, tokens: shouldSearch ? [] : data.tokens }))

    if (shouldSearch) {
      debouncedSearchChange(filter)
    }
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <TwInput
        className="placeholder:text-neon"
        placeholder="Search for a token"
        containerProps={{
          className: 'mt-6 mx-4.5',
        }}
        value={actionData.filter}
        onChangeText={handleValueChange}
        clearable
        autoCapitalize="none"
      />

      <Skeleton.Root loading={actionData.loading} className="mt-4 w-full">
        <Skeleton.Group>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton.Item key={`trustline-skeleton-${index}`} className="h-12 w-full rounded-md" />
          ))}
        </Skeleton.Group>
        <Skeleton.Content className="size-full">
          <FlatList
            className="w-full"
            ListEmptyComponent={
              <Text className="my-8 text-center font-sans-regular text-lg text-gray-300">
                {actionState.changed.filter ? t('noTokensFound') : t('placeholderMessage')}
              </Text>
            }
            ItemSeparatorComponent={() => <TwSeparator withoutContainer />}
            data={data}
            renderItem={renderItem}
          />
        </Skeleton.Content>
      </Skeleton.Root>
    </TwModalLayout>
  )
}
