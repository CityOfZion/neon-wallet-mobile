import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import { ConnectionItem } from '~/src/components/ConnectionItem'
import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { Account } from '~/src/store/account/Account'
import { LinearLayout } from '~/src/styles/styled-components'

export type AccountConnectionsScreenParams = {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountConnectionsScreen'>
}

const AccountConnectionsScreen = ({ route }: Props) => {
  const account = route.params.account

  const { sessions } = useWalletConnectWallet()

  const accountSessions = sessions.filter(session => {
    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)
    return account.address === address
  })

  return (
    <ScreenLayout withoutScrollView>
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
