import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { AppError } from '@/helpers/ErrorHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useFileSystem } from './useFileSystem'
import { useNeonBackupFile } from './useNeonBackupFile'
import { useNeonMigrateFile } from './useNeonMigrateFile'
import { useNep6BackupFile } from './useNep6BackupFile'

import type { TUseImportFromFileData } from '@/types/hooks'

export type TUseImportFromFileResult = TUseImportFromFileData & { fileName: string }

export const useImportFromFile = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useImportFromFile' })
  const { readFile } = useFileSystem()
  const neonBackupFileActions = useNeonBackupFile()
  const neonMigrateFileActions = useNeonMigrateFile()
  const nep6BackupFileActions = useNep6BackupFile()

  const [isBrowsing, setIsBrowsing] = useState(false)

  const handleBrowse = async (): Promise<TUseImportFromFileResult | undefined> => {
    const file = await readFile('application/json')
    if (!file) return undefined

    setIsBrowsing(true)
    try {
      // Two frames so the spinner actually paints before detection blocks the JS thread
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const backupFile = neonBackupFileActions.validateAndParseFile(file.name, file.content)
      if (backupFile) {
        ToastHelper.success({ message: t('backupFileDetected') })
        return { type: 'backup', backupFile, fileName: file.name }
      }

      const nep6Content = nep6BackupFileActions.validateAndParseFile(file.content)
      if (nep6Content) {
        ToastHelper.success({ message: t('nep6FileDetected') })
        return { ...nep6Content, fileName: file.name }
      }

      const migrateContent = neonMigrateFileActions.validateAndParseFile(file.content)
      if (migrateContent) {
        ToastHelper.success({ message: t('migrateFileDetected') })
        return { ...migrateContent, fileName: file.name }
      }

      throw new AppError(t('errors.invalidFile'))
    } finally {
      setIsBrowsing(false)
    }
  }

  return {
    isBrowsing,
    handleBrowse,
  }
}
