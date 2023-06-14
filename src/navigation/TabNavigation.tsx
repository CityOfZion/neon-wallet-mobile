import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import { DefaultNavigationParam } from '../types/global'
import WalletConnectStackNavigation, { WalletConnectStackParams } from './WalletConnectStackNavigation'
import WalletStackNavigation, { WalletStackParam } from './WalletsStackNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import FooterBar from '~src/components/layout/FooterBar'
import ContactsStackNavigation, { ContactsStackParams } from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation, { MoreStackParam } from '~src/navigation/MoreStackNavigation'

export type TabStackParamList = {
  ListWallets: WalletStackParam
  Contacts: ContactsStackParams
  More: MoreStackParam
  WalletConnect?: WalletConnectStackParams
}

export type TabParams = DefaultNavigationParam<WalletStackParam> | DefaultNavigationParam<MoreStackParam> | undefined

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  return (
    <Tab.Navigator tabBar={props => <FooterBar {...props} />}>
      <Tab.Screen name={wrapper.route.ListWallets.name} component={WalletStackNavigation} />
      <Tab.Screen name={wrapper.route.WalletConnect.name} component={WalletConnectStackNavigation} />
      <Tab.Screen name={wrapper.route.Contacts.name} component={ContactsStackNavigation} />
      <Tab.Screen name={wrapper.route.More.name} component={MoreStackNavigation} />
    </Tab.Navigator>
  )
}

export default TabNavigation
