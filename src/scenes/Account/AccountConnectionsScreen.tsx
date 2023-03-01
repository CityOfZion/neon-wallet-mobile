import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import { ConnectionItem } from '~/src/components/ConnectionItem'
import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { useWalletConnect } from '~/src/contexts/WalletConnectContext'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { LinearLayout } from '~/src/styles/styled-components'

export type AccountConnectionsScreenParams = {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountConnectionsScreen'>
}

const AccountConnectionsScreen = ({ route, navigation }: Props) => {
  const account = route.params.account

  const { sessions } = useWalletConnect()
  const accountSessions = useMemo(
    () =>
      sessions.filter(session => {
        const [walletConnectAccount] = WalletConnectHelper.getAccountInformationFromSession(session)

        return account.address === walletConnectAccount.address
      }),
    [sessions]
  )

  return (
    <ScreenLayout darkerSolidColorBG scrollable={false}>
      <AccountSubTitle account={account} />

      <LinearLayout my="44px">
        <FlatList
          data={accountSessions}
          renderItem={({ item }) => <ConnectionItem session={item} />}
          ListEmptyComponent={<FlatListEmpty label={i18n.t('screens.AccountConnectionsScreen.noDAppsConnected')} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default AccountConnectionsScreen
