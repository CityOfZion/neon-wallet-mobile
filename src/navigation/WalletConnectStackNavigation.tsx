import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'
import { DefaultNavigationParam } from '../types/global'

import { wrapper } from '~src/app/ApplicationWrapper'
import WalletConnectPage, { WalletConnectPageParams } from '~src/scenes/walletConnect/WalletConnectPage'

export type WalletConnectStackParams = DefaultNavigationParam<WalletConnectPageParams>

export type WalletConnectStackParamList = {
  WalletConnectPage?: WalletConnectPageParams
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
