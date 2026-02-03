import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as ExpoSharing from 'expo-sharing'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { AppError } from '@/helpers/ErrorHelper'

type TFileSystemMimeType = 'application/json' | 'text/csv' | 'image/png'

const EXTENSIONS_BY_MIME_TYPE: Record<TFileSystemMimeType, string> = {
  'application/json': 'json',
  'text/csv': 'csv',
  'image/png': 'png',
}

const ENCODING_BY_MIME_TYPE: Record<TFileSystemMimeType, FileSystem.EncodingType> = {
  'application/json': FileSystem.EncodingType.UTF8,
  'text/csv': FileSystem.EncodingType.UTF8,
  'image/png': FileSystem.EncodingType.Base64,
}

export const useFileSystem = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useFileSystem' })

  const writeFile = async (fileName: string, data: string, mimeType: TFileSystemMimeType) => {
    let fileUri = ''

    if (Platform.OS === 'ios') {
      const fileExtension = EXTENSIONS_BY_MIME_TYPE[mimeType]
      fileUri = `${FileSystem.cacheDirectory}${fileName}.${fileExtension}`
    } else {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

      if (!permissions.granted) throw new AppError(t('errors.directory'))

      fileUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimeType)
    }

    const encoding = ENCODING_BY_MIME_TYPE[mimeType]
    await FileSystem.writeAsStringAsync(fileUri, data, { encoding })

    if (Platform.OS === 'ios') {
      await ExpoSharing.shareAsync(fileUri, {
        mimeType: mimeType,
        UTI: 'public.text',
      })
      await FileSystem.deleteAsync(fileUri)
    }
  }

  const readFile = async (mimetype: TFileSystemMimeType) => {
    const { assets, canceled } = await DocumentPicker.getDocumentAsync({
      type: mimetype,
    })
    if (!assets || assets.length === 0 || canceled) return

    const [file] = assets

    const content = await FileSystem.readAsStringAsync(file.uri)

    return {
      ...file,
      content,
    }
  }

  return {
    writeFile,
    readFile,
  }
}
