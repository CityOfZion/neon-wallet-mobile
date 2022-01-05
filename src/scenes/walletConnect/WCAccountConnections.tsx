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
import HeaderActionButton from '~/src/components/layout/HeaderActionButton'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {Account} from '~/src/models/redux/Account'
import {RootStackParamList} from '~/src/navigation/AppNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export type WCAccountConnectionsParams = {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'WCAccountConnections'>
}

const WCAccountConnections = ({route, navigation}: Props) => {
  const walletConnectCtx = useWalletConnect()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)

  const account = route.params.account

  navigation.setOptions({
    headerTitle: () => (
      <LinearLayout alignItems="center" justifyContent="center" pt={'28px'}>
        <TextView fontSize={'24px'} fontWeight={500} color={'text.0'}>
          {i18n.t('screens.WCAccountConnections.title')}
        </TextView>
        <LinearLayout
          orientation={'horiz'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={'16px'}
        >
          <LinearLayout
            width="12px"
            height="12px"
            bg={account.backgroundColor}
            borderRadius={7}
            mr={'8px'}
          />
          <TextView color={'text.14'} fontSize={'14px'}>
            {account.name ?? ''}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    ),
  })

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

  return walletConnectCtx.sessions.length > 0 ? (
    <ScreenLayout solidColorBG>
      <LinearLayout paddingHorizontal={20} paddingVertical={50}>
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
    </ScreenLayout>
  ) : (
    <ScreenLayout solidColorBG>
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
          {i18n.t('screens.WCAccountConnections.noDAppsConnected')}
        </TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default WCAccountConnections
