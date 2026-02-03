import { useCallback } from 'react'

import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import { useTranslation } from 'react-i18next'

import { AppError } from '@/helpers/ErrorHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

export const useMediaLibrary = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useMediaLibrary' })

  const writeMedia = useCallback(
    async (base64Data: string, fileName: string) => {
      const { status } = await MediaLibrary.getPermissionsAsync(true, ['photo'])
      if (status !== 'granted') {
        const { status: requestStatus } = await MediaLibrary.requestPermissionsAsync(true, ['photo'])
        if (requestStatus !== 'granted') {
          ToastHelper.info({ message: t('errors.permissionRequired') })
          throw new AppError(t('errors.permissionRequired'))
        }
      }

      const fileUri = FileSystem.cacheDirectory + fileName + '.png'
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 })

      await MediaLibrary.saveToLibraryAsync(fileUri)
    },
    [t]
  )

  return { writeMedia }
}
