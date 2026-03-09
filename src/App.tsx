import { lazy, Suspense, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { LogBox, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'

import ScreenLoader from './components/ScreenLoader'
import { Setup } from './components/Setup'
import { BlockchainServiceHelper } from './helpers/BlockchainServiceHelper'
import { EnvHelper } from './helpers/EnvHelper'
import { I18nextHelper } from './helpers/I18nextHelper'
import { LoggerHelper } from './helpers/LoggerHelper'
import { NativeWindHelper } from './helpers/NativeWindHelper'
import { ReactNavigationHelper } from './helpers/ReactNavigationHelper'
import { ReactQueryHelper } from './helpers/ReactQueryHelper'
import { ReduxHelper } from './helpers/ReduxHelper'
import { SentryHelper } from './helpers/SentryHelper'
import { WalletKitHelper } from './helpers/WalletKitHelper'
import { useMount } from './hooks/useMount'
import { RootStack } from './routes/stacks/RootStack'

import './styles/global.css'

const Alert = lazy(() => import('./components/Alert'))
const QrCodeScanModal = lazy(() => import('./components/QrCodeScanModal'))

const Toaster = lazy(() => import('./components/Toaster'))
const NfcModal = lazy(() => import('./components/NfcModal'))

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'A non-serializable value was detected in an action',
])

ExpoSplashScreen.preventAutoHideAsync()

export const App = () => {
  const [ready, setReady] = useState(false)

  useMount(async () => {
    try {
      await EnvHelper.setup()
      await Promise.all([
        SentryHelper.setup(),
        I18nextHelper.setup(),
        BlockchainServiceHelper.setup(),
        NativeWindHelper.setup(),
        WalletKitHelper.setup(),
      ])
      ReduxHelper.setup()
      await ReduxHelper.waitForBootstrap()
    } catch (error) {
      LoggerHelper.sentry(error, { operation: 'setup', where: 'App' })
    } finally {
      setReady(true)
      ExpoSplashScreen.hide()
    }
  }, [])

  if (!ready) return null

  return (
    <StoreProvider store={ReduxHelper.store}>
      <QueryClientProvider client={ReactQueryHelper.client}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <NavigationContainer
              linking={ReactNavigationHelper.getLinking()}
              fallback={<ScreenLoader className="bg-asphalt" />}
            >
              <Setup />

              <RootStack />
            </NavigationContainer>

            <Suspense fallback={null}>
              <Alert />
              <Toaster />
              <QrCodeScanModal />

              {/* IOS already has a native NFC modal */}
              {Platform.OS === 'android' && <NfcModal />}

              <StatusBar style="light" translucent backgroundColor="transparent" />
            </Suspense>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </StoreProvider>
  )
}
