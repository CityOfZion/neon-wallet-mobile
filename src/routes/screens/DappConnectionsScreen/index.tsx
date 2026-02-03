import React, { useEffect } from 'react'

import type { SessionTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { DappConnectionItem } from '@/components/DappConnectionItem'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'
import { useWalletConnectSessions } from '@/hooks/useWalletConnectSessions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbPlus from '@/assets/images/tb-plus.svg'

import type { TDappConnectionsStackScreenProps } from '@/types/stacks'

const renderItem: ListRenderItem<SessionTypes.Struct> = ({ item }) => {
  return <DappConnectionItem session={item} />
}

export const DappConnectionsScreen = ({
  navigation,
  route,
}: TDappConnectionsStackScreenProps<'DappConnectionsScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'dappConnectionsScreen' })
  const { isNotConnected } = useIsConnectedSelector()
  const sessionsQuery = useWalletConnectSessions()

  const sessions = sessionsQuery.data ?? []

  const handlePressAdd = () => {
    navigation.navigate('DappConnectionModal')
  }

  useEffect(() => {
    if (!route.params?.uri) return

    const abortController = new AbortController()

    const handleNavigate = async () => {
      await UtilsHelper.sleep(500)

      if (abortController.signal.aborted) return

      navigation.navigate('DappConnectionModal', route.params)
    }

    handleNavigate()

    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.params?.uri])

  return (
    <TwScreenLayout
      title={t('title')}
      withoutScroll
      withoutBackButton
      rightElement={
        <TwIconButton onPress={handlePressAdd} disabled={isNotConnected} aria-hidden icon={<TbPlus aria-hidden />} />
      }
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        className="w-full"
        contentContainerClassName="flex-1 mb-6"
        data={sessions}
        renderItem={renderItem}
        keyExtractor={item => item.topic}
        ItemSeparatorComponent={TwSeparator}
        ListEmptyComponent={
          <FlatListEmpty label={t('noDappsConnected')} className="w-full">
            <TwButton
              className="border-dashed"
              colorSchema="white"
              leftElement={<TbPlus aria-hidden />}
              label={t('connectDappLabel')}
              variant="outline"
              disabled={isNotConnected}
              onPress={handlePressAdd}
            />
          </FlatListEmpty>
        }
      />

      {sessions.length > 0 && (
        <TwButton
          variant="outline"
          leftElement={<TbPlus aria-hidden />}
          label={t('connectNewDappLabel')}
          disabled={isNotConnected}
          onPress={handlePressAdd}
        />
      )}
    </TwScreenLayout>
  )
}
