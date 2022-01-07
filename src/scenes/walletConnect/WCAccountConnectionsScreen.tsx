/* eslint-disable react/display-name */
import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {FlatList, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import DappConnectedCard, {
  DappConnectedCardProps,
} from './components/DappConnectedCard'
import ListSeparator from './components/ListSeparator'
import {IDappInfo} from './components/WCConnectedDapps'

import {wrapper} from '~/src/app/ApplicationWrapper'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {Account} from '~/src/models/redux/Account'
import {RootStackParamList} from '~/src/navigation/AppNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export type WCAccountConnectionsScreenParams = {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'WCAccountConnectionsScreen'>
}

const WCAccountConnectionsScreen = ({route, navigation}: Props) => {
  const walletConnectCtx = useWalletConnect()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)

  const account = route.params.account

  const handleNavigation = (dappInfo: IDappInfo) => {
    if (walletConnectCtx.sessions.length > 0) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectionDetailsModal.name,
        params: {
          dapp: dappInfo,
        },
      })
    }
  }

  const items: DappConnectedCardProps[] = walletConnectCtx.sessions
    .filter((session) =>
      session.state.accounts.some((sessionAccount) => {
        const [, , address] = sessionAccount.split(':')

        return account.address === address
      })
    )
    .map((session) => {
      const connectedAcc = session.state.accounts.map((it) => {
        const info = it.split(':')
        const account = accountsPool.find(
          (account) => account.address === info[2]
        )
        return {
          account,
          wallet: account?.getWallet(walletsPool),
        }
      })

      const dAppInfo: IDappInfo = {
        session,
        connectedAcc,
      }

      return {
        dAppName: session.peer.metadata.name,
        sessionExpiry: session.expiry,
        iconUri: session.peer.metadata.icons[0],
        onPress: () => {
          handleNavigation(dAppInfo)
        },
      }
    })

  return (
    <ScreenLayout solidColorBG>
      <AccountSubTitle account={account} />

      {walletConnectCtx.sessions.length > 0 ? (
        <LinearLayout paddingHorizontal={20} my="50px">
          <ScrollView>
            <FlatList
              data={items}
              renderItem={({item}) => <DappConnectedCard {...item} />}
              ItemSeparatorComponent={ListSeparator}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
          <ListSeparator />
        </LinearLayout>
      ) : (
        <LinearLayout
          height={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <TextView
            fontFamily={'medium'}
            fontSize={'24px'}
            color={'text.11'}
            textAlign={'center'}
          >
            {i18n.t('screens.WCAccountConnectionsScreen.noDAppsConnected')}
          </TextView>
        </LinearLayout>
      )}
    </ScreenLayout>
  )
}

export default WCAccountConnectionsScreen
