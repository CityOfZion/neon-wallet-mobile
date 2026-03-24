import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import type { TValidationSchemaHelperBackupFileSchema } from '@/helpers/ValidationSchemaHelper'

import { useNeonImportBackup } from '@/hooks/useNeonBackup'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdArrowForward from '@/assets/images/md-arrow-forward.svg'
import TbEyeSearch from '@/assets/images/tb-eye-search.svg'
import TbFileImport from '@/assets/images/tb-file-import.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ImportBackupModal = ({ navigation }: TRootStackScreenProps<'ImportBackupModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'importBackupModal' })
  const { t: tCommon } = useTranslation('common')

  const { handleBrowserFile, handleTryDecryptData, handleImportBackupData } = useNeonImportBackup()

  const [backupFile, setBackupFile] = useState<TValidationSchemaHelperBackupFileSchema>()

  const handleBrowseClick = async () => {
    const file = await handleBrowserFile()
    setBackupFile(file)
  }

  const handleConfirm = async () => {
    navigation.navigate('PasswordModal', {
      title: t('title'),
      buttonProps: {
        label: t('passwordModal.buttonLabel'),
        leftElement: <TbFileImport aria-hidden />,
      },
      inputProps: {
        label: t('passwordModal.inputLabel'),
      },
      description: t('passwordModal.description'),
      async onConfirm(password) {
        const backupData = handleTryDecryptData(backupFile!, password)
        await handleImportBackupData(backupData)
      },
      onSuccess() {
        navigation.navigate('SuccessModal', {
          title: t('title'),
          content: t('successModal.description'),
          buttonLabel: t('successModal.submitButtonLabel'),
        })
      },
    })
  }

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton />}
      contentContainerClassName="justify-between"
    >
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
        />
      </View>

      <View className="mt-7 gap-7">
        {backupFile && <TwBanner type="success">{t('successFile')}</TwBanner>}

        <TwSeparator />

        <TwButton
          label={tCommon('general.next')}
          variant="contained-light"
          rightElement={<MdArrowForward aria-hidden />}
          disabled={!backupFile}
          onPress={handleConfirm}
        />
      </View>
    </TwModalLayout>
  )
}
