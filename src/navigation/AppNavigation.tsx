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
import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import WalletView from '~src/scenes/WalletView'
import TabNavigation from '~src/navigation/TabNavigation'
import ModalStackNavigation from '~src/navigation/ModalStackNavigation'
import {defaultScreenOptions} from '~src/App'

type RootStackParamList = {
  Tab: undefined
  Modal: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <RootStack.Navigator
          initialRouteName="Tab"
          headerMode="none"
          screenOptions={defaultScreenOptions}
        >
          <RootStack.Screen name="Tab" component={TabNavigation} />
          <RootStack.Screen name="Modal" component={ModalStackNavigation} />
        </RootStack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default AppNavigation
