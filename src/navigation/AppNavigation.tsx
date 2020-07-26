import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import LoadingOverlay from '../components/LoadingOverlay'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {Sync} from '~src/app/Sync'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import LoginStackNavigation from '~src/navigation/LoginStackNavigation'
import ModalStackNavigation, {
  ModalParams,
} from '~src/navigation/ModalStackNavigation'
import TabNavigation, {
  TabParams,
  TabStackParamList,
} from '~src/navigation/TabNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'

export type RootStackParamList = {
  Tab: TabParams
  Modal: ModalParams
  Login: undefined
  Onboarding: undefined
} & TabStackParamList

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => {
    return Facade.theme[state.settings.theme]
  })
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeHidden, setWelcomeHidden] = useState(true)

  const dispatch = useDispatch<AsyncDispatch>()

  const startApplication = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeHidden = await Storage.welcomeHidden.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeHidden(welcomeHidden ?? false)

    // Synchronize app reducer
    await Sync.init(dispatch)
  }

  useEffect(() => {
    Facade.await.run('application', startApplication, 1000)
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
                  name={Facade.route.Modal.name}
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
