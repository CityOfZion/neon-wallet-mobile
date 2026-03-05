import { useEffect, useState } from 'react'

import { AppState, PermissionsAndroid, Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'

import { useMount } from './useMount'

const requestBluetoothPermission = async () => {
  if (Platform.OS !== 'android') {
    return {
      bluetooth: true,
      location: true,
    }
  }

  const apiLevel = parseInt(Platform.Version.toString(), 10)
  if (apiLevel < 31) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED
    return {
      bluetooth: isGranted,
      location: isGranted,
    }
  }

  if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ])

    return {
      bluetooth:
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED,
      location: result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED,
    }
  }

  return {
    bluetooth: false,
    location: false,
  }
}

export const useBluetooth = () => {
  const [bluetoothState, setBluetoothState] = useState<
    'Unknown' | 'Resetting' | 'Unsupported' | 'Unauthorized' | 'PoweredOff' | 'PoweredOn'
  >()
  const [bluetoothPermissionIsGranted, setBluetoothPermissionIsGranted] = useState<boolean>()
  const [locationPermissionIsGranted, setLocationPermissionIsGranted] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(true)

  useMount(
    () => {
      const bluetoothManager = new BleManager()
      const subscription = bluetoothManager.onStateChange(state => {
        setBluetoothState(state)
      }, true)

      return () => {
        subscription.remove()
      }
    },
    [],
    1000
  )

  useEffect(() => {
    if (!bluetoothState) return

    if (bluetoothState !== 'PoweredOn') {
      setIsLoading(false)
      return
    }

    const listener = () => {
      requestBluetoothPermission().then(({ bluetooth, location }) => {
        setIsLoading(false)
        setBluetoothPermissionIsGranted(bluetooth)
        setLocationPermissionIsGranted(location)
      })
    }

    const focusListener = AppState.addEventListener('focus', listener)

    listener()

    return () => {
      focusListener.remove()
    }
  }, [bluetoothState])

  return {
    bluetoothState,
    bluetoothPermissionIsGranted,
    locationPermissionIsGranted,
    isLoading,
  }
}
