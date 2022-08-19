import NetInfo from '@react-native-community/netinfo'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { onlineManager, focusManager } from 'react-query'

export const useBeforeStartApp = () => {
  const [started, setStarted] = useState(false)

  const reactQueryWatchNetwork = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected, isInternetReachable }) => {
      onlineManager.setOnline(!!isConnected && !!isInternetReachable)
    })

    return unsubscribe
  }, [])

  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        bold: require('~src/assets/fonts/sofiapro-bold.otf'),
        medium: require('~src/assets/fonts/sofiapro-medium.otf'),
        regular: require('~src/assets/fonts/sofiapro-regular.otf'),
        italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
        semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
        light: require('~src/assets/fonts/sofiapro-light.otf'),
      })
    } catch {}
  }, [])

  const reactQueryWatchAppState = useCallback(() => {
    AppState.addEventListener('change', status => focusManager.setFocused(status === 'active'))

    return () => {
      AppState.removeEventListener('change', status => focusManager.setFocused(status === 'active'))
    }
  }, [])

  const start = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync()
      await loadFonts()
    } finally {
      setStarted(true)
    }
  }, [loadFonts])

  useEffect(() => {
    const unsubscribeReactQueryWatchAppState = reactQueryWatchAppState()
    const unsubscribeReactQueryWatchNetwork = reactQueryWatchNetwork()

    return () => {
      unsubscribeReactQueryWatchAppState()
      unsubscribeReactQueryWatchNetwork()
    }
  }, [reactQueryWatchNetwork, reactQueryWatchAppState])

  useEffect(() => {
    start()
  }, [start])

  return started
}
