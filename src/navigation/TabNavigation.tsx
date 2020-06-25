import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import React from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import TabBar from '~src/components/TabBar/TabBar'
import ContactsStackNavigation from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import SettingsStackNavigation from '~src/navigation/SettingsStackNavigation'
import WalletStackNavigation from '~src/navigation/WalletsStackNavigation'
import {RootState} from '~src/store/reducers/root'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name={ROUTES.WALLET.name}
          component={WalletStackNavigation}
        />
        <Tab.Screen
          name={ROUTES.CONTACTS.name}
          component={ContactsStackNavigation}
        />
        <Tab.Screen
          name={ROUTES.QUICK_TOOLS.name}
          component={QuickToolsStackNavigation}
        />
        <Tab.Screen
          name={ROUTES.SETTINGS.name}
          component={SettingsStackNavigation}
        />
        <Tab.Screen name={ROUTES.MORE.name} component={MoreStackNavigation} />
      </Tab.Navigator>
    </ThemeProvider>
  )
}

export default TabNavigation
