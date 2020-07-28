import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import FooterBar from '~src/components/layout/FooterBar'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import ContactsStackNavigation from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import SettingsStackNavigation from '~src/navigation/SettingsStackNavigation'
import WalletStackNavigation from '~src/navigation/WalletsStackNavigation'
import {CustomizeAccountParams} from '~src/scenes/CustomizeAccount'
import {ImportReadAccountParams} from '~src/scenes/ImportReadAccount'
import {PassphraseParams} from '~src/scenes/Passphrase'

export type TabStackParamList = {
  ListWallets: undefined
  Contacts: undefined
  Settings: undefined
  More:
    | DefaultNavigationParam<
        DefaultNavigationParam<
          | Partial<CustomizeAccountParams>
          | ImportReadAccountParams
          | PassphraseParams
          | undefined
        >
      >
    | undefined
}

export type TabParams =
  | (DefaultNavigationParam & Partial<{welcomeHidden?: boolean}>)
  | undefined

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'Tab'>
}

const Tab = createBottomTabNavigator()

const TabNavigation = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const [welcomeHidden, setWelcomeHidden] = useState(
    props.route.params?.welcomeHidden ?? true
  )

  useEffect(() => {
    if (!welcomeHidden) {
      props.navigation.navigate(Facade.route.Modal.name, {
        screen: Facade.route.WelcomeModal.name,
      })
      setWelcomeHidden(true)
    }
  }, [welcomeHidden])

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
