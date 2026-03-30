import { useEffect } from 'react'

import * as ExpoUpdates from 'expo-updates'
import { useTranslation } from 'react-i18next'

import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useMount } from '@/hooks/useMount'

export const OverTheAirManagerSetup = () => {
  const { t } = useTranslation('common', { keyPrefix: 'overTheAir' })
  const { isDownloading, downloadError, downloadProgress, downloadedUpdate } = ExpoUpdates.useUpdates()

  useEffect(() => {
    if (downloadError) {
      ToastHelper.dismiss('over-the-air')
      ToastHelper.error({ message: t('error') })
      LoggerHelper.sentry(downloadError, { where: 'OverTheAirManagerSetup', operation: 'downloadUpdate' })
      return
    }

    if (downloadedUpdate) {
      ToastHelper.dismiss('over-the-air')
      ToastHelper.success({ message: t('success') })
      return
    }

    if (isDownloading) {
      const progress = Math.floor((downloadProgress || 0) * 100)
      ToastHelper.loading({ message: t('downloading', { progress }), id: 'over-the-air' })
    }
  }, [downloadError, downloadProgress, downloadedUpdate, isDownloading, t])

  useMount(() => {
    const callbackId = requestIdleCallback(
      async () => {
        try {
          if (!ExpoUpdates.isEnabled || __DEV__) return

          const update = await ExpoUpdates.checkForUpdateAsync()
          if (!update.isAvailable) return

          await ExpoUpdates.fetchUpdateAsync()
        } catch (error) {
          LoggerHelper.sentry(error, {
            where: 'OverTheAirManagerSetup',
            operation: 'checkForUpdateAsync/fetchUpdateAsync',
          })
        }
      },
      { timeout: 3000 }
    )

    return () => {
      cancelIdleCallback(callbackId)
    }
  })

  return null
}
