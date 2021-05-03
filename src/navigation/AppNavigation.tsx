import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {InteractionManager} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import PasscodeStackNavigation, {
  PasscodeStackParams,
} from './PasscodeStackNavigation'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {Sync} from '~src/app/Sync'
import LoadingOverlay from '~src/components/LoadingOverlay'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {DeepLinkingConfig} from '~src/config/DeepLinkingConfig'
import ModalStackNavigation, {
  ModalParams,
} from '~src/navigation/ModalStackNavigation'
import TabNavigation, {TabParams} from '~src/navigation/TabNavigation'
import LoginPage from '~src/scenes/LoginPage/LoginPage'
import OnboardingPage from '~src/scenes/OnboardingPage'
import QRCodeScan, {QRCodeScanParams} from '~src/scenes/QRCodeScan'

export type RootStackParamList = {
  Tab: TabParams
  Modal: ModalParams
  Login: undefined
  PasscodeStack: PasscodeStackParams
  Onboarding: undefined
  QRCodeScan: QRCodeScanParams
}

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const RootStack = createStackNavigator<RootStackParamList>()

const deepLinking = new DeepLinkingConfig()

const AppNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => {
    return Facade.theme[state.settings.theme]
  })
  const {isConnected} = useSelector((state: RootState) => state.network)
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeToNWSeen, setWelcomeToNWSeen] = useState(true)
  const [welcomeHidden, setWelcomeHidden] = useState(true)
  const [hasAuthentication, setHasAuthentication] = useState(false)
  const [
    hasAuthenticationForHardware,
    setHasAuthenticationForHardware,
  ] = useState(false)
  const [changelogHidden, setChangelogHidden] = useState(true)
  const [numberOfVersions, setNumberOfVersions] = useState(0)

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [hasInit, setInit] = useState(false)

  const startApplication = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeToNWSeen = await Storage.welcomeToNWSeen.load()
    const welcomeHidden = await Storage.welcomeHidden.load()
    const hasAuthentication = await Storage.hasAuthentication.load()
    const hasAuthenticationForHardware = await Storage.hasAuthenticationForHardware.load()
    const changelogHidden = await Storage.changelogHidden.load()
    const numberOfVersions = await Storage.numberOfVersions.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeToNWSeen(welcomeToNWSeen ?? false)
    setWelcomeHidden(welcomeHidden ?? false)
    setHasAuthentication(hasAuthentication ?? false)
    setHasAuthenticationForHardware(hasAuthenticationForHardware ?? false)
    setChangelogHidden(changelogHidden ?? false)
    setNumberOfVersions(numberOfVersions ?? 0)

    try {
      // Synchronize app reducer
      await Sync.init(dispatchAsync)
      setInit(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (hasInit) {
      let interactionPromise = InteractionManager.runAfterInteractions()

      const interval = setInterval(() => {
        interactionPromise = InteractionManager.runAfterInteractions(() => {
          Facade.await.run('refreshData', () => Sync.refresh(dispatchAsync))
        })
      }, Facade.app.defaultDataRefreshTimeInMilliseconds)

      return () => {
        interactionPromise.cancel()
        clearInterval(interval)
      }
    } else {
      Facade.await.run('application', startApplication, 1000)
    }
  }, [hasInit])

  useEffect(() => {
    if (isConnected) {
      let interactionPromise = InteractionManager.runAfterInteractions()

      const interval = setInterval(() => {
        interactionPromise = InteractionManager.runAfterInteractions(() => {
          Facade.await.run('fetchData', () => Sync.fetchs(dispatchAsync))
        })
      }, Facade.app.defaultDataRefreshTimeInMilliseconds)

      return () => {
        interactionPromise.cancel()
        clearInterval(interval)
      }
    }
  }, [isConnected])

  const getInitialRouteName = () => {
    return onboardingSeen
      ? hasAuthentication || welcomeToNWSeen
        ? Facade.route.Tab.name
        : Facade.route.Login.name
      : Facade.route.Onboarding.name
  }

  deepLinking.setInitialRoute(getInitialRouteName())

  const linking = deepLinking.getLinkingConfig()
  return (
    <>
      <>
        <AwaitActivity name={'application'} loadingView={<ScreenLoader />}>
          <NavigationContainer linking={linking} fallback={<ScreenLoader />}>
            {isLoading && (
              <LoadingOverlay progress={progress} loadingText={loadingText} />
            )}
            <ThemeProvider theme={theme}>
              <RootStack.Navigator
                initialRouteName={getInitialRouteName()}
                headerMode="none"
                screenOptions={Facade.config.screen}
              >
                <RootStack.Screen
                  name="Tab"
                  component={TabNavigation}
                  initialParams={{
                    welcomeHidden,
                    changelogHidden,
                    numberOfVersions,
                  }}
                />
                <RootStack.Screen
                  name={Facade.route.Onboarding.name}
                  component={OnboardingPage}
                />
                <RootStack.Screen
                  name={Facade.route.QRCodeScan.name}
                  component={QRCodeScan}
                />
                <RootStack.Screen
                  name={Facade.route.Login.name}
                  component={LoginPage}
                />
                <RootStack.Screen
                  name={Facade.route.PasscodeStack.name}
                  component={PasscodeStackNavigation}
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
