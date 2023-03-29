import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'

import { wrapper } from '~src/app/ApplicationWrapper'
import WalletConnectPage from '~src/scenes/walletConnect/WalletConnectPage'
export type WalletConnectStackParamList = {
  WalletConnectPage: undefined
}

const WalletConnectStack = createStackNavigator<WalletConnectStackParamList>()

const WalletConnectStackNavigation = () => {
  return (
    <WalletConnectStack.Navigator screenOptions={stackConfig}>
      <WalletConnectStack.Screen name={wrapper.route.WalletConnectPage.name} component={WalletConnectPage} />
    </WalletConnectStack.Navigator>
  )
}

export default WalletConnectStackNavigation
