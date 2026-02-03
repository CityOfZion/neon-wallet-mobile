import { useCallback, useEffect, useRef } from 'react'

import { Camera, CameraView, type ScanningResult } from 'expo-camera'
import type { EventSubscription } from 'expo-notifications'
import { useTranslation } from 'react-i18next'

import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

export const useQrCode = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useQrCode' })
  const subscriptionRef = useRef<EventSubscription>(null)

  const launchScanner = useCallback(async () => {
    const { granted } = await Camera.getCameraPermissionsAsync()

    if (!granted) {
      const { granted: requestGranted } = await Camera.requestCameraPermissionsAsync()
      if (!requestGranted) {
        ToastHelper.info({ message: t('errors.permissionNotGranted') })
        return
      }
    }

    if (!CameraView.isModernBarcodeScannerAvailable) {
      const message = t('errors.cameraUnavailable')
      LoggerHelper.error(message, { where: 'useQrCode', operation: 'launchScanner' })
      ToastHelper.info({ message })
      return
    }

    let result: ScanningResult | undefined

    try {
      const subscription = CameraView.onModernBarcodeScanned(data => {
        result = data
      })
      subscriptionRef.current = subscription

      await CameraView.launchScanner({ barcodeTypes: ['qr'] })
      await CameraView.dismissScanner()

      subscriptionRef.current?.remove()
      subscriptionRef.current = null
    } catch (error) {
      LoggerHelper.error(error, { where: 'useQrCode', operation: 'launchScanner' })
    }

    return result?.data
  }, [t])

  useEffect(() => {
    const getScanPermission = async () => {}

    getScanPermission()
  }, [])

  useEffect(() => {
    return () => {
      subscriptionRef.current?.remove()
    }
  }, [])

  return {
    launchScanner,
  }
}
