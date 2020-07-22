import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import LoadingOverlay from '../components/LoadingOverlay'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import LoginStackNavigation from '~src/navigation/LoginStackNavigation'
import ModalStackNavigation from '~src/navigation/ModalStackNavigation'
import TabNavigation from '~src/navigation/TabNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import {RootStore} from '~src/store/RootStore'

export type RootStackParamList = {
  Tab: (DefaultNavigationParam & Partial<{welcomeHidden?: boolean}>) | undefined
  Modal:
    | (DefaultNavigationParam & Partial<{onColorPicked: (hex: string) => void}>)
    | undefined
  Login: undefined
  Onboarding: undefined
}

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeHidden, setWelcomeHidden] = useState(true)

  const dispatch = useDispatch()

  const populate = async () => {
    const currency = await Storage.currency.load()
    const language = await Storage.language.load()
    const theme = await Storage.theme.load()
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeHidden = await Storage.welcomeHidden.load()

    if (currency) {
      dispatch(RootStore.app.actions.setCurrency(currency))
    }

    if (language) {
      dispatch(RootStore.app.actions.setLanguage(language))
    }

    if (theme) {
      dispatch(RootStore.app.actions.setTheme(theme))
    }

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeHidden(welcomeHidden ?? false)
  }

  useEffect(() => {
    Facade.await.run('application', populate, 1000)
  }, [])

  return (
    <>
      <>
        <AwaitActivity name={'application'} loadingView={<ScreenLoader />}>
          <NavigationContainer>
            {isLoading && (
              <LoadingOverlay progress={progress} loadingText={loadingText} />
            )}
            <ThemeProvider theme={theme}>
              <RootStack.Navigator
                initialRouteName={
                  onboardingSeen
                    ? Facade.route.Login.name
                    : Facade.route.Onboarding.name
                }
                headerMode="none"
                screenOptions={Facade.config.screen}
              >
                <RootStack.Screen
                  name="Tab"
                  component={TabNavigation}
                  initialParams={{welcomeHidden}}
                />
                <RootStack.Screen
                  name={Facade.route.Onboarding.name}
                  component={OnboardingPage}
                />
                <RootStack.Screen
                  name={Facade.route.Login.name}
                  component={LoginStackNavigation}
                />
                <RootStack.Screen
                  name="Modal"
                  component={ModalStackNavigation}
                  initialParams={props.route?.params}
                />
              </RootStack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </AwaitActivity>
      </>
    </>
  )
}

export default AppNavigation
