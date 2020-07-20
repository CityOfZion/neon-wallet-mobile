import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import React from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import FooterBar from '~src/components/layout/FooterBar'
import ContactsStackNavigation from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import SettingsStackNavigation from '~src/navigation/SettingsStackNavigation'
import WalletStackNavigation from '~src/navigation/WalletsStackNavigation'

export type TabStackParamList = {
  More: {screen: string}
}

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <Tab.Navigator tabBar={(props) => <FooterBar {...props} />}>
        <Tab.Screen
          name={Facade.route.ListWallets.name}
          component={WalletStackNavigation}
        />
        <Tab.Screen
          name={Facade.route.Contacts.name}
          component={ContactsStackNavigation}
        />
        <Tab.Screen
          name={Facade.route.QuickTools.name}
          component={QuickToolsStackNavigation}
        />
        <Tab.Screen
          name={Facade.route.Settings.name}
          component={SettingsStackNavigation}
        />
        <Tab.Screen
          name={Facade.route.More.name}
          component={MoreStackNavigation}
        />
      </Tab.Navigator>
    </ThemeProvider>
  )
}

export default TabNavigation
