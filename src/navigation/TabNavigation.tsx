import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { RootState } from '../store/RootStore'
import { DefaultNavigationParam } from '../types/global'
import { ModalStackParamList } from './ModalStackNavigation'
import WalletConnectStackNavigation from './WalletConnectStackNavigation'
import WalletStackNavigation, { WalletStackParam } from './WalletsStackNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import FooterBar from '~src/components/layout/FooterBar'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import ContactsStackNavigation, { ContactsStackParams } from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation, { MoreStackParam } from '~src/navigation/MoreStackNavigation'

export type TabStackParamList = {
  ListWallets: WalletStackParam
  Contacts: ContactsStackParams
  More: MoreStackParam
  WalletConnectPage: undefined
}

export type TabParams = DefaultNavigationParam<WalletStackParam> | DefaultNavigationParam<MoreStackParam> | undefined

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<RootStackParamList, 'Tab'>
}

const Tab = createBottomTabNavigator()

const TabNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <ThemeProvider theme={theme}>
      <StatusBar translucent barStyle={theme.statusBarStyle} backgroundColor="transparent" />
      <Tab.Navigator tabBar={props => <FooterBar {...props} />}>
        <Tab.Screen name={wrapper.route.ListWallets.name} component={WalletStackNavigation} />
        <Tab.Screen name={wrapper.route.WalletConnectPage.name} component={WalletConnectStackNavigation} />
        <Tab.Screen name={wrapper.route.Contacts.name} component={ContactsStackNavigation} />
        <Tab.Screen name={wrapper.route.More.name} component={MoreStackNavigation} />
      </Tab.Navigator>
    </ThemeProvider>
  )
}

export default TabNavigation
