import { useEffect } from 'react'

import { onlineManager } from '@tanstack/react-query'
import { useNetworkState } from 'expo-network'

import { useAppDispatch } from '@/hooks/useRedux'

import { utilityReducerActions } from '@/store/reducers/utility'

export const InternetManagerSetup = () => {
  const dispatch = useAppDispatch()
  const { isConnected, isInternetReachable } = useNetworkState()

  useEffect(() => {
    if (typeof isConnected === 'undefined' || typeof isInternetReachable === 'undefined') return

    onlineManager.setOnline(isConnected)
    dispatch(utilityReducerActions.setIsConnected(isConnected))
  }, [dispatch, isConnected, isInternetReachable])

  return null
}
