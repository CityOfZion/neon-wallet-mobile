import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'

import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {WCNoConnectDapps} from '~/src/scenes/walletConnect/components/WCNoConnectDapps'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {WalletConnectStackParamList} from '~src/navigation/WalletConnectStackNavigation'

interface WalletConnectPageProps {
  navigation: StackNavigationProp<WalletConnectStackParamList>
  route: RouteProp<WalletConnectStackParamList, 'WalletConnectPage'>
}

const WalletConnectPage = (props: WalletConnectPageProps) => {
  const {sessions} = useWalletConnect()
  return sessions.length < 1 ? (
    <WCNoConnectDapps />
  ) : (
    <ScreenLayout padding={20}></ScreenLayout>
  )
}

export default WalletConnectPage
