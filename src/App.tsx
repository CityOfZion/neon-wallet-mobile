import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { AppStateStatus, Platform, StatusBar } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { QueryClient, QueryClientProvider, focusManager } from 'react-query'
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
import { useAppState, useOnlineManager } from '~src/hooks'
import AppNavigation from '~src/navigation/AppNavigation'
import { RootStore } from '~src/store/RootStore'

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

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

const App = () => {
  useOnlineManager()

  useAppState(onAppStateChange)

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
    return null
  }

  return (
    <StoreProvider store={store}>
      <StatusBar barStyle="light-content" />
      <ErrorBound>
        <WalletConnectContextProvider options={wcOptions}>
          <QueryClientProvider client={queryClient}>
            <AppNavigation />
          </QueryClientProvider>
        </WalletConnectContextProvider>
      </ErrorBound>
      <FlashMessage position="top" MessageComponent={ThemedAlert} />
    </StoreProvider>
  )
}

export default App
