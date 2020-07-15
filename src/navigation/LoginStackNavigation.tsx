import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useNavigation} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import FooterBar from '~src/components/layout/FooterBar'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ContactsStackNavigation from '~src/navigation/ContactsStackNavigation'
import MoreStackNavigation from '~src/navigation/MoreStackNavigation'
import QuickToolsStackNavigation from '~src/navigation/QuickToolsStackNavigation'
import SettingsStackNavigation from '~src/navigation/SettingsStackNavigation'
import WalletStackNavigation from '~src/navigation/WalletsStackNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import WelcomePage from '~src/scenes/WelcomePage'
import LoginPage from '~src/scenes/LoginPage/LoginPage'

const LoginStack = createStackNavigator()

const LoginStackNavigation = () => {
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
    Facade.await.run('loginNavigation', populate)
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
    <AwaitActivity name={'loginNavigation'} loadingView={<ScreenLoader />}>
      <ThemeProvider theme={theme}>
        <StatusBar
          translucent
          barStyle={theme.statusBarStyle}
          backgroundColor="transparent"
        />
        <LoginStack.Navigator
          initialRouteName={Facade.route.Login.name}
          headerMode="none"
          screenOptions={Facade.config.screen}
        >
          <LoginStack.Screen
            name={Facade.route.Login.name}
            component={LoginPage}
          />
        </LoginStack.Navigator>
      </ThemeProvider>
    </AwaitActivity>
  )
}

export default LoginStackNavigation
