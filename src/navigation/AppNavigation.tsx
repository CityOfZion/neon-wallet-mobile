import {JsonRpcRequest} from '@json-rpc-tools/utils'
import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import React, {useCallback, useEffect, useState} from 'react'
import {InteractionManager} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import PasscodeStackNavigation, {
  PasscodeStackParams,
} from './PasscodeStackNavigation'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Storage} from '~src/app/Storage'
import {Sync} from '~src/app/Sync'
import {
  blockchainServices,
  getBlockchainByAddress,
  hasWCIntegration,
} from '~src/blockchain'
import LoadingOverlay from '~src/components/LoadingOverlay'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {applicationConfig} from '~src/config/ApplicationConfig'
import {DeepLinkingConfig} from '~src/config/DeepLinkingConfig'
import {screenConfig} from '~src/config/ScreenConfig'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
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
    return wrapper.theme[state.settings.theme]
  })
  const {isConnected} = useSelector((state: RootState) => state.network)
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {status: timerStatus} = useSelector((state: RootState) => state.timer)
  const {progress, loadingText, isLoading} = loadingOverlayState

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeToNWSeen, setWelcomeToNWSeen] = useState(true)
  const [hasAuthentication, setHasAuthentication] = useState(false)

  const walletConnectCtx = useWalletConnect()

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [hasInit, setInit] = useState(false)
  const [syncFetchInterval, setFetchSyncInterval] = useState(10000)

  const startApplication = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeToNWSeen = await Storage.welcomeToNWSeen.load()
    const hasAuthentication = await Storage.hasAuthentication.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeToNWSeen(welcomeToNWSeen ?? false)
    setHasAuthentication(hasAuthentication ?? false)

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
          Await.run('refreshData', () => Sync.refresh(dispatchAsync))
          Await.run('fetchData', () => Sync.fetchs(dispatchAsync))
        })
      }, syncFetchInterval)

      if (isConnected) {
        setFetchSyncInterval(
          applicationConfig.defaultDataRefreshTimeInMilliseconds
        )
      } else {
        clearInterval(interval)
      }

      if (!timerStatus) {
        clearInterval(interval)
      }

      return () => {
        interactionPromise.cancel()
        clearInterval(interval)
      }
    } else {
      !hasInit && Await.run('application', startApplication)
    }
  }, [hasInit, syncFetchInterval, isConnected, timerStatus])

  const handleCleanConnectionsDApps = useCallback(async () => {
    await walletConnectCtx.cleanConnections()
  }, [walletConnectCtx.sessions])

  useEffect(() => {
    // if the request method is 'testInvoke' or 'multiTestInvoke' we auto-accept it
    walletConnectCtx.autoAcceptIntercept(
      (acc, chain, req: JsonRpcRequest) =>
        req.method === 'testInvoke' || req.method === 'multiTestInvoke'
    )

    walletConnectCtx.onRequestListener(
      async (acc, chain, req: JsonRpcRequest) => {
        console.log('debug request lintener => ', acc, chain, req)
        const blockchain = getBlockchainByAddress(acc)
        if (blockchain) {
          const bs = blockchainServices[blockchain]
          if (hasWCIntegration(bs)) {
            const result = await bs.rpcCall(acc, req)
            if (!result.hasOwnProperty('error')) {
              console.log('deu certo', [result])
            } else {
              console.log('deu errado', [result])
            }
            return result
          }
        }
        throw new Error('Failed request listener')
      }
    )
  }, [])

  useEffect(() => {
    handleCleanConnectionsDApps()
  }, [walletConnectCtx.sessions])

  const getInitialRouteName = () => {
    return onboardingSeen
      ? hasAuthentication || welcomeToNWSeen
        ? wrapper.route.Tab.name
        : wrapper.route.Login.name
      : wrapper.route.Onboarding.name
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
                screenOptions={screenConfig}
              >
                <RootStack.Screen name="Tab" component={TabNavigation} />
                <RootStack.Screen
                  name={wrapper.route.Onboarding.name}
                  component={OnboardingPage}
                />
                <RootStack.Screen
                  name={wrapper.route.QRCodeScan.name}
                  component={QRCodeScan}
                />
                <RootStack.Screen
                  name={wrapper.route.Login.name}
                  component={LoginPage}
                />
                <RootStack.Screen
                  name={wrapper.route.PasscodeStack.name}
                  component={PasscodeStackNavigation}
                />
                <RootStack.Screen
                  name={wrapper.route.Modal.name}
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
