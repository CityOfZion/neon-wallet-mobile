import { JsonRpcRequest } from '@json-rpc-tools/utils'
import { NavigationContainer, RouteProp } from '@react-navigation/native'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useEffect, useRef, useState } from 'react'
import { InteractionManager } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { blockchainServices, getBlockchainByAddress, hasWCIntegration } from '../blockchain'
import { applicationConfig } from '../config/ApplicationConfig'
import { useWalletConnect } from '../contexts/WalletConnectContext'
import PasscodeStackNavigation, { PasscodeStackParams } from './PasscodeStackNavigation'

import { createStackNavigator } from '~/node_modules/@react-navigation/stack'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Storage } from '~src/app/Storage'
import { Sync } from '~src/app/Sync'
import LoadingOverlay from '~src/components/LoadingOverlay'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { DeepLinkingConfig } from '~src/config/DeepLinkingConfig'
import { screenConfig } from '~src/config/ScreenConfig'
import ModalStackNavigation, { ModalParams } from '~src/navigation/ModalStackNavigation'
import TabNavigation, { TabParams } from '~src/navigation/TabNavigation'
import LoginPage from '~src/scenes/LoginPage/LoginPage'
import OnboardingPage from '~src/scenes/OnboardingPage'
import QRCodeScan, { QRCodeScanParams } from '~src/scenes/QRCodeScan'

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
  const { isLoading, loadingText, progress } = useSelector((state: RootState) => state.loading)
  const timerStatus = useSelector((state: RootState) => state.timer.status)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const walletConnectCtx = useWalletConnect()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeToNWSeen, setWelcomeToNWSeen] = useState(true)
  const [hasAuthentication, setHasAuthentication] = useState(false)
  const [hasInit, setInit] = useState(false)

  const interactionRef = useRef<any>()
  const intervalRef = useRef<NodeJS.Timeout>()

  const startApplication = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeToNWSeen = await Storage.welcomeToNWSeen.load()
    const hasAuthentication = await Storage.hasAuthentication.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeToNWSeen(welcomeToNWSeen ?? false)
    setHasAuthentication(hasAuthentication ?? false)

    await Sync.init(dispatchAsync)
    setInit(true)

    InteractionManager.runAfterInteractions(async () => {
      await Sync.fetchs(dispatchAsync)
      await Sync.refresh(dispatchAsync)
    })
  }

  useEffect(() => {
    if (!hasInit) {
      Await.run('application', startApplication)
    }
  }, [hasInit])

  useEffect(() => {
    if (!hasInit) {
      return
    }

    if (!isConnected || !timerStatus) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }

      if (interactionRef.current) {
        interactionRef.current.cancel()
        interactionRef.current = undefined
      }

      return
    }

    if (intervalRef.current && interactionRef.current) {
      return
    }

    intervalRef.current = setInterval(() => {
      interactionRef.current = InteractionManager.runAfterInteractions(async () => {
        await Sync.fetchs(dispatchAsync)
        await Sync.refresh(dispatchAsync)
      })
    }, applicationConfig.defaultDataRefreshTimeInMilliseconds)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)

      if (interactionRef.current) interactionRef.current.cancel()
    }
  }, [isConnected, timerStatus, hasInit])

  useEffect(() => {
    async function handle() {
      if (!hasInit) {
        return
      }

      if (!isConnected && walletConnectCtx.initialized) {
        showMessage({
          message: i18n.t('walletconnect.internetConnectionLost'),
          type: 'danger',
          duration: 5000,
        })
        await walletConnectCtx.resetApp()
        return
      }

      if (isConnected && !walletConnectCtx.initialized) {
        await walletConnectCtx.init()
      }
    }

    handle()
  }, [isConnected, hasInit])

  useEffect(() => {
    walletConnectCtx.autoAcceptIntercept(
      (_accountAddress, _chain, request: JsonRpcRequest) =>
        request.method === 'testInvoke' || request.method === 'multiTestInvoke'
    )

    walletConnectCtx.onRequestListener(async (accountAddress, _chain, request: JsonRpcRequest) => {
      const blockchain = getBlockchainByAddress(accountAddress)

      if (blockchain) {
        const bs = blockchainServices[blockchain]

        if (hasWCIntegration(bs)) {
          const result = await bs.rpcCall(accountAddress, request)

          return result
        }
      }
      throw new Error('Failed request listener')
    })
  }, [])

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
        <AwaitActivity name="application" loadingView={<ScreenLoader />}>
          <NavigationContainer linking={linking} fallback={<ScreenLoader />}>
            {isLoading && <LoadingOverlay progress={progress} loadingText={loadingText} />}
            <ThemeProvider theme={theme}>
              <RootStack.Navigator
                initialRouteName={getInitialRouteName()}
                headerMode="none"
                screenOptions={screenConfig}
              >
                <RootStack.Screen name={wrapper.route.Tab.name} component={TabNavigation} />
                <RootStack.Screen name={wrapper.route.Onboarding.name} component={OnboardingPage} />
                <RootStack.Screen name={wrapper.route.QRCodeScan.name} component={QRCodeScan} />
                <RootStack.Screen name={wrapper.route.Login.name} component={LoginPage} />
                <RootStack.Screen name={wrapper.route.PasscodeStack.name} component={PasscodeStackNavigation} />
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
