import { useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import type { TUseImportFromFileResult } from '@/hooks/useImportFromFile'
import { useImportFromFile } from '@/hooks/useImportFromFile'
import { useNeonBackupFile } from '@/hooks/useNeonBackupFile'

import { ModalLayout } from '@/layouts/ModalLayout'

import MdArrowForward from '@/assets/images/md-arrow-forward.svg'
import TbEyeSearch from '@/assets/images/tb-eye-search.svg'
import TbFileImport from '@/assets/images/tb-file-import.svg'

import type { TRootStackParamList } from '@/types/stacks'

export const ImportBackupModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'importBackup' })
  const { t: tCommon } = useTranslation('common')
  const { handleBrowse, isBrowsing } = useImportFromFile()
  const { handleTryDecryptData, handleGenerateData, handleImportBackupData } = useNeonBackupFile()
  const navigation = useNavigation<NativeStackNavigationProp<TRootStackParamList>>()

  const [importFile, setImportFile] = useState<TUseImportFromFileResult>()

  const handleBrowseClick = async () => {
    if (importFile) {
      setImportFile(undefined)
    }

    try {
      const result = await handleBrowse()
      if (result) setImportFile(result)
    } catch (error) {
      LoggerHelper.error(error, { where: 'ImportBackupModal', operation: 'handleBrowse' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handleConfirmFile = () => {
    if (!importFile) return

    if (importFile.type === 'nep6') {
      navigation.navigate('Nep6BackupImportAccountSelectionModal', { content: importFile.content })
      return
    }

    if (importFile.type === 'migrate') {
      navigation.navigate('MigrateFromNeon2AccountSelectionModal', { content: importFile.content })
      return
    }

    navigation.navigate('PasswordModal', {
      title: t('title'),
      buttonProps: { label: t('password.buttonLabel'), leftElement: <TbFileImport aria-hidden /> },
      inputProps: { label: t('password.inputLabel') },
      description: t('password.description'),
      async onConfirm(password) {
        const decryptedData = handleTryDecryptData(importFile.backupFile, password)
        const generatedData = handleGenerateData(decryptedData)

        await handleImportBackupData(generatedData)
      },
      onSuccess() {
        navigation.navigate('SuccessModal', {
          title: t('title'),
          content: t('success.description'),
          buttonLabel: t('success.submitButtonLabel'),
        })
      },
    })
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="justify-between">
        <View>
          <Text className="font-sans-regular text-lg text-white">{t('description1')}</Text>

          <TwSeparator className="my-7" />

          <Text className="font-sans-regular text-lg text-white">{t('description2')}</Text>

          <TwButton
            className="mt-6"
            label={t('locateButtonLabel')}
            variant="outline"
            leftElement={<TbEyeSearch aria-hidden />}
            onPress={handleBrowseClick}
            isLoading={isBrowsing}
          />
        </View>

        <View className="mb-4 mt-7 gap-7">
          {importFile && <TwBanner type="success">{t(`${importFile.type}FileDetected`)}</TwBanner>}

          <TwSeparator />

          <TwButton
            label={tCommon('general.next')}
            variant="contained-light"
            rightElement={<MdArrowForward aria-hidden />}
            disabled={!importFile}
            onPress={handleConfirmFile}
          />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
