import React from 'react'
import { StatusBar } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { QueryClientProvider } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { contextsConfig } from './config/ContextsConfig'
import { useBeforeStartApp } from './hooks/useBeforeStartApp'

import { ThemedAlert } from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import { WalletConnectContextProvider } from '~src/contexts/WalletConnectContext'
import AppNavigation from '~src/navigation/AppNavigation'

const App = () => {
  const started = useBeforeStartApp()

  if (!started) {
    return null
  }

  return (
    <StoreProvider store={contextsConfig.store}>
      <PersistGate persistor={contextsConfig.persistor}>
        <QueryClientProvider client={contextsConfig.queryClient}>
          <WalletConnectContextProvider options={contextsConfig.wcOptions}>
            <StatusBar barStyle="light-content" />
            <ErrorBound>
              <AppNavigation />
            </ErrorBound>
            <FlashMessage position="top" MessageComponent={ThemedAlert} />
          </WalletConnectContextProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}

export default App
