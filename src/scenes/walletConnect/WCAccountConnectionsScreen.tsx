import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useCallback, useState } from 'react'
import { FlatList, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import DappConnectedCard, { DappConnectedCardProps } from './components/DappConnectedCard'
import ListSeparator from './components/ListSeparator'
import { IDappInfo } from './components/WCConnectedDapps'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Storage } from '~/src/app/Storage'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import { useWalletConnect } from '~/src/contexts/WalletConnectContext'
import { Account } from '~/src/models/redux/Account'
import { WCApprovalDate } from '~/src/models/redux/WCApprovalDate'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { LinearLayout, TextView } from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export type WCAccountConnectionsScreenParams = {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'WCAccountConnectionsScreen'>
}

const WCAccountConnectionsScreen = ({ route, navigation }: Props) => {
  const walletConnectCtx = useWalletConnect()
  const accountsPool = useSelector(selectAccounts)
  const walletsPool = useSelector(selectWallets)
  const [approvalDatesPool, setApprovalDatesPool] = useState<WCApprovalDate[] | null>(null)

  const syncApprovalDates = useCallback(async () => {
    const result = await Storage.wcApprovalDates.load()
    setApprovalDatesPool(result)
  }, [])

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
    .filter(session =>
      session.state.accounts.some(sessionAccount => {
        const [, , address] = sessionAccount.split(':')

        return account.address === address
      })
    )
    .map(session => {
      let approvedDate: WCApprovalDate | undefined
      const connectedAcc = session.state.accounts.map(it => {
        const info = it.split(':')
        const account = accountsPool.find(account => account.address === info[2])
        return {
          account,
          wallet: account?.getWallet(walletsPool),
        }
      })

      if (approvalDatesPool !== null) {
        approvedDate = approvalDatesPool.find(it => it.sessionTopic === session.topic)
      }

      const dAppInfo: IDappInfo = {
        session,
        connectedAcc,
        approvedDate: approvedDate?.approvalDate ?? 0,
      }

      return {
        dAppName: session.peer.metadata.name,
        approvedDate: dAppInfo.approvedDate,
        iconUri: session.peer.metadata.icons[0],
        onPress: () => {
          handleNavigation(dAppInfo)
        },
      }
    })

  useEffect(() => {
    syncApprovalDates()
  }, [items])

  return (
    <ScreenLayout darkerSolidColorBG>
      <AccountSubTitle account={account} />

      {walletConnectCtx.sessions.length > 0 ? (
        <LinearLayout paddingHorizontal={20} my="50px">
          <ScrollView>
            <FlatList
              data={items}
              renderItem={({ item }) => <DappConnectedCard {...item} />}
              ItemSeparatorComponent={ListSeparator}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
          <ListSeparator />
        </LinearLayout>
      ) : (
        <LinearLayout height="100%" justifyContent="center" alignItems="center">
          <TextView fontFamily="medium" fontSize="24px" color="text.11" textAlign="center">
            {i18n.t('screens.WCAccountConnectionsScreen.noDAppsConnected')}
          </TextView>
        </LinearLayout>
      )}
    </ScreenLayout>
  )
}

export default WCAccountConnectionsScreen
