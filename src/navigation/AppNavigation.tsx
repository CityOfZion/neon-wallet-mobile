import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { DeepLinkingConfig } from '../config/DeepLinkingConfig'
import { useAfterStartApp } from '../hooks/useAfterStartApp'
import SetupCompletePage, { SetupCompleteParamList } from '../scenes/SetupCompletePage'
import { RootState } from '../store/RootStore'

import { createStackNavigator } from '~/node_modules/@react-navigation/stack'
import { wrapper } from '~src/app/ApplicationWrapper'
import { screenConfig } from '~src/config/ScreenConfig'
import ModalStackNavigation, { ModalParams } from '~src/navigation/ModalStackNavigation'
import TabNavigation, { TabParams } from '~src/navigation/TabNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import { QRCodeScan, QRCodeScanParams } from '~src/scenes/QRCodeScan'

export type RootStackParamList = {
  Tab: TabParams
  Modal: ModalParams
  Onboarding: undefined
  QRCodeScan: QRCodeScanParams
  SetupCompletePage: SetupCompleteParamList
}

const RootStack = createStackNavigator<RootStackParamList>()

const deepLinking = new DeepLinkingConfig()

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => {
    return wrapper.theme[state.settings.theme]
  })
  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)

  const [navigationStarted, setNavigationStarted] = useState(false)

  const navigationRef = useRef<NavigationContainerRef>(null)

  useAfterStartApp({ navigationStarted, navigationRef: navigationRef.current })

  const getInitialRouteName = () => {
    return isFirstTime ? wrapper.route.Onboarding.name : wrapper.route.Tab.name
  }

  const handleNavigationReady = () => {
    setNavigationStarted(true)
  }

  deepLinking.setInitialRoute(getInitialRouteName())

  const linking = deepLinking.getLinkingConfig()

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={theme.statusBarStyle} translucent backgroundColor="rgba(255,255,255,0)" />
      <NavigationContainer linking={linking} onReady={handleNavigationReady} ref={navigationRef}>
        <RootStack.Navigator initialRouteName={getInitialRouteName()} headerMode="none" screenOptions={screenConfig}>
          <RootStack.Screen name={wrapper.route.Tab.name} component={TabNavigation} />
          <RootStack.Screen name={wrapper.route.Onboarding.name} component={OnboardingPage} />
          <RootStack.Screen name={wrapper.route.QRCodeScan.name} component={QRCodeScan} />
          <RootStack.Screen name={wrapper.route.SetupCompletePage.name} component={SetupCompletePage} />
          <RootStack.Screen name={wrapper.route.Modal.name} component={ModalStackNavigation} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default AppNavigation
