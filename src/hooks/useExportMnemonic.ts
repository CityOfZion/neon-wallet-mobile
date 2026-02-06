import { useTranslation } from 'react-i18next'

import { DateHelper } from '@/helpers/DateHelper'

import { useFileSystem } from './useFileSystem'
import { useLanguageSelector } from './useSettingsSelector'

export const useExportMnemonic = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useExportMnemonic' })
  const { language } = useLanguageSelector()
  const { writeFile } = useFileSystem()

  const saveMnemonicToTextFile = async (mnemonic: string) => {
    const fileName = `NWM-MNEMONIC-${Date.now()}.txt`
    const content = t('fileTemplate', {
      mnemonic,
      generatedAt: DateHelper.formatLocalized(new Date(), { format: 'PPPp', language }),
    })

    await writeFile(fileName, content, 'text/txt')
  }

  return { saveMnemonicToTextFile }
}
