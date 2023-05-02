import { WalletConnectWalletProvider } from '@cityofzion/wallet-connect-sdk-wallet-react'
import React, { useRef } from 'react'
import FlashMessage from 'react-native-flash-message'
import { QueryClientProvider } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { ContextsConfig } from './config/ContextsConfig'
import { useBeforeStartApp } from './hooks/useBeforeStartApp'

import { ThemedAlert } from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import AppNavigation from '~src/navigation/AppNavigation'

const App = () => {
  const contextsConfig = useRef(new ContextsConfig()).current
  const started = useBeforeStartApp()

  if (!started) {
    return null
  }

  return (
    <StoreProvider store={contextsConfig.store}>
      <PersistGate persistor={contextsConfig.persistor}>
        <QueryClientProvider client={contextsConfig.queryClient}>
          <WalletConnectWalletProvider options={contextsConfig.walletConnectOptions}>
            <ErrorBound>
              <AppNavigation />
            </ErrorBound>
            <FlashMessage position="top" MessageComponent={ThemedAlert} />
          </WalletConnectWalletProvider>
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  )
}

export default App
