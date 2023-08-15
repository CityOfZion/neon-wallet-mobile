import { WalletConnectWalletProvider } from '@cityofzion/wallet-connect-sdk-wallet-react'
import * as SplashScreen from 'expo-splash-screen'
import React, { useRef } from 'react'
import FlashMessage from 'react-native-flash-message'
import { QueryClientProvider } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { ContextsConfig } from './config/ContextsConfig'

import AnimatedAppLoader from '~src/components/AnimatedAppLoader'
import { ThemedAlert } from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import AppNavigation from '~src/navigation/AppNavigation'

SplashScreen.preventAutoHideAsync()

const App = () => {
  const contextsConfig = useRef(new ContextsConfig()).current

  return (
    <AnimatedAppLoader image={require('src/assets/splash-darker.png')}>
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
    </AnimatedAppLoader>
  )
}

export default App
