import {useAsyncStorage} from '@react-native-community/async-storage'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useNavigation} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
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
import Onboarding from '~src/scenes/Onboarding'
import WelcomePage from '~src/scenes/WelcomePage'
import {RootState} from '~src/store/reducers/root'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const navigation = useNavigation()

  const onboardingStorage = useAsyncStorage('@onboardingSeen')
  const welcomeStorage = useAsyncStorage('@welcomeDontShow')
  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeDontShow, setWelcomeDontShow] = useState(true)

  const checkOptions = async () => {
    const seen = await onboardingStorage.getItem()
    const dontShow = await welcomeStorage.getItem()

    setOnboardingSeen(seen === 'true')
    setWelcomeDontShow(dontShow === 'true')
  }

  useEffect(() => {
    checkOptions()
  }, [])

  const onCloseWelcomeEvent = async (routeTargetName?: string) => {
    await setWelcomeDontShow(true)

    if (routeTargetName) {
      navigation.navigate(routeTargetName)
    }
  }

  if (!onboardingSeen) {
    return <Onboarding seenSetter={setOnboardingSeen} />
  } else if (!welcomeDontShow) {
    return <WelcomePage onClose={onCloseWelcomeEvent} />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name={ROUTES.LIST_WALLETS.name}
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
