import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useNavigation} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import FooterBar from '~src/components/layout/FooterBar'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import AwaitActivity from '~src/components/misc/AwaitActivity'
import ContactsStackNavigation from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import SettingsStackNavigation from '~src/navigation/SettingsStackNavigation'
import WalletStackNavigation from '~src/navigation/WalletsStackNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import WelcomePage from '~src/scenes/WelcomePage'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const navigation = useNavigation()

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeHidden, setWelcomeHidden] = useState(true)

  const populate = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeHidden = await Storage.welcomeHidden.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeHidden(welcomeHidden ?? false)
  }

  useEffect(() => {
    Facade.await.run('tabNavigation', populate)
  }, [])

  const onCloseWelcomeEvent = async (routeTargetName?: string) => {
    await setWelcomeHidden(true)

    if (routeTargetName) {
      navigation.navigate(routeTargetName)
    }
  }

  if (!onboardingSeen) {
    return <OnboardingPage seenSetter={setOnboardingSeen} />
  }

  if (!welcomeHidden) {
    return <WelcomePage onClose={onCloseWelcomeEvent} />
  }

  return (
    <AwaitActivity name={'tabNavigation'} loadingView={<ScreenLoader />}>
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
    </AwaitActivity>
  )
}

export default TabNavigation
