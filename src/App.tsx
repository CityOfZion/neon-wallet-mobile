import { configureStore } from '@reduxjs/toolkit'
import { SignClientTypes } from '@walletconnect/types'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { AppStateStatus, Platform, StatusBar } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { QueryClient, QueryClientProvider, focusManager } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { ThemedAlert } from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import {
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_RELAY_URL,
  DEFAULT_PROJECT_ID,
} from '~src/config/walletConnect/constants'
import { WalletConnectContextProvider } from '~src/contexts/WalletConnectContext'
import { useAppState } from '~src/hooks/useAppState'
import { useOnlineManager } from '~src/hooks/useOnlineManager'
import AppNavigation from '~src/navigation/AppNavigation'
import { RootStore } from '~src/store/RootStore'

const wcOptions: SignClientTypes.Options = {
  projectId: DEFAULT_PROJECT_ID,
  metadata: DEFAULT_APP_METADATA,
  logger: DEFAULT_LOGGER,
  relayUrl: DEFAULT_RELAY_URL,
}

const store = configureStore({
  reducer: RootStore.reducers,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  ],
})

const persistor = persistStore(store)

function onAppStateChange(status: AppStateStatus) {
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
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="light-content" />
        <ErrorBound>
          <WalletConnectContextProvider options={wcOptions}>
            <QueryClientProvider client={queryClient}>
              <AppNavigation />
            </QueryClientProvider>
          </WalletConnectContextProvider>
        </ErrorBound>
        <FlashMessage position="top" MessageComponent={ThemedAlert} />
      </PersistGate>
    </StoreProvider>
  )
}

export default App
