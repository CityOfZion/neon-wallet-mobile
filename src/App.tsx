import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Font from 'expo-font'
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { StatusBar } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { Provider as StoreProvider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { ThemedAlert } from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import {
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_NETWORKS,
  DEFAULT_RELAY_PROVIDER,
} from '~src/config/walletConnect/constants'
import { CtxOptions, WalletConnectContextProvider } from '~src/contexts/WalletConnectContext'
import AppNavigation from '~src/navigation/AppNavigation'
import { RootStore } from '~src/store/RootStore'
import * as SplashScreen from 'expo-splash-screen'
import { ReduxNetworkProvider } from 'react-native-offline'

const wcOptions: CtxOptions = {
  appMetadata: DEFAULT_APP_METADATA,
  chainIds: Object.keys(DEFAULT_NETWORKS),
  logger: DEFAULT_LOGGER,
  methods: DEFAULT_METHODS,
  relayServer: DEFAULT_RELAY_PROVIDER,
  storageOptions: {
    asyncStorage: AsyncStorage as any,
  },
}

const store = createStore(RootStore.reducers, {}, applyMiddleware(thunk))

const App = () => {
  const [dataLoaded, setDataLoaded] = useState(false)

  const fetchFonts = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync()
      await Font.loadAsync({
        bold: require('~src/assets/fonts/sofiapro-bold.otf'),
        medium: require('~src/assets/fonts/sofiapro-medium.otf'),
        regular: require('~src/assets/fonts/sofiapro-regular.otf'),
        italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
        semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
        light: require('~src/assets/fonts/sofiapro-light.otf'),
      })
    
    } catch (error) {

    } finally {
      setDataLoaded(true)
    }
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (dataLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [dataLoaded])

  useEffect(() => {
    fetchFonts()
  }, [])

  useLayoutEffect(() => {
    onLayoutRootView()
  }, [onLayoutRootView])

  if (!dataLoaded) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <ReduxNetworkProvider>
        <StatusBar barStyle="light-content" />
        <ErrorBound>
          <WalletConnectContextProvider options={wcOptions}>
            <AppNavigation />
          </WalletConnectContextProvider>
        </ErrorBound>
        <FlashMessage position="top" MessageComponent={ThemedAlert} />
      </ReduxNetworkProvider>
    </StoreProvider>
  )
}

export default App
