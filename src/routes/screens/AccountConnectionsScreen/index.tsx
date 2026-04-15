import React from 'react'

import type { SessionTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'
import { FlatList, type ListRenderItem, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { DappConnectionItem } from '@/components/DappConnectionItem'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { useWalletConnectSessions } from '@/hooks/useWalletConnectSessions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import MdAdd from '@/assets/images/md-add.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'

const renderItem: ListRenderItem<SessionTypes.Struct> = ({ item }) => {
  return <DappConnectionItem session={item} />
}

const AccountConnectionsScreen = ({ navigation, route }: TWalletsStackScreenProps<'AccountConnectionsScreen'>) => {
  const account = route.params.account

  const { t } = useTranslation('screens', { keyPrefix: 'accountConnections' })

  const sessionsQuery = useWalletConnectSessions(account)

  const sessions = sessionsQuery.data || []

  const handlePressAdd = () => {
    navigation.navigate('DappConnectionModal', { account })
  }

  return (
    <TwScreenLayout
      title={t('title')}
      withoutScroll
      rightElement={
        <TwIconButton
          aria-label={t('labels.addConnection')}
          icon={<MdAdd aria-hidden className="size-10 text-white" />}
          onPress={handlePressAdd}
        />
      }
    >
      <AccountSubTitle account={account} />

      <View className="my-11">
        <FlatList
          data={sessions}
          renderItem={renderItem}
          ItemSeparatorComponent={TwSeparator}
          ListEmptyComponent={
            <FlatListEmpty
              label={t('emptyList')}
              footer={
                <TwButton
                  className="mt-4 border border-dashed border-gray-300"
                  variant="outline"
                  labelProps={{
                    className: 'text-white',
                  }}
                  label={t('connectDappLabel')}
                  leftElement={<MdAdd aria-hidden className="size-9 text-white" />}
                  onPress={handlePressAdd}
                />
              }
            />
          }
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </TwScreenLayout>
  )
}

export default AccountConnectionsScreen
