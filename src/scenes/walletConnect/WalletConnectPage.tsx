import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'

import ScreenLayout from '~src/components/layout/ScreenLayout'
import {WalletConnectStackParamList} from '~src/navigation/WalletConnectStackNavigation'

interface WalletConnectPageProps {
  navigation: StackNavigationProp<WalletConnectStackParamList>
  route: RouteProp<WalletConnectStackParamList, 'WalletConnectPage'>
}

const WalletConnectPage = (props: WalletConnectPageProps) => {
  return <ScreenLayout padding={20}></ScreenLayout>
}

export default WalletConnectPage
