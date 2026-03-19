import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { QrCodeScanModalHelper } from '@/helpers/QrCodeScanModalHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import type { TValidationSchemaHelperBackupFileSchema } from '@/helpers/ValidationSchemaHelper'

import { useImportAction } from '@/hooks/useImportAction'
import { useNeonImportBackup } from '@/hooks/useNeonBackup'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'
import TbCheck from '@/assets/images/tb-check.svg'
import TbEyeSearch from '@/assets/images/tb-eye-search.svg'
import TbFileImport from '@/assets/images/tb-file-import.svg'
import TbQrcode from '@/assets/images/tb-qrcode.svg'
import TbX from '@/assets/images/tb-x.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingImportModal = ({ navigation, route }: TRootStackScreenProps<'OnboardingImportModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'onboardingImportModal' })
  const { t: tCommon } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { handleBrowserFile, handleTryDecryptData, handleImportBackupData } = useNeonImportBackup()

  const [backupFile, setBackupFile] = useState<TValidationSchemaHelperBackupFileSchema>()

  const handleImportComplete = async () => {
    route.params.onConfirm()

    dispatch(settingsReducerActions.setIsFirstTime(false))

    AnalyticsHelper.logEvent('wallet_imported')

    navigation.pop(2)

    await UtilsHelper.sleep(1000)

    navigation.navigate('OnboardingCompletedScreen', { isImport: true })
  }

  const handleSubmitAddress = async (address: string) => {
    navigation.navigate('ImportAddressSelectionModal', { address, onConfirm: handleImportComplete })
  }

  const handleSubmitMnemonic = async (mnemonic: string) => {
    navigation.navigate('ImportMnemonicSelectionModal', {
      mnemonic,
      onConfirm: handleImportComplete,
    })
  }

  const handleSubmitKey = async (key: string) => {
    navigation.navigate('ImportKeySelectionModal', {
      key,
      onConfirm: handleImportComplete,
    })
  }

  const handleSubmitEncryptedKey = async (encryptedKey: string) => {
    navigation.navigate('ImportEncryptedKeySelectionModal', {
      encryptedKey,
      onConfirm: handleImportComplete,
    })
  }

  const { actionData, actionState, handleSubmit, handleAct, handleChange, reset } = useImportAction({
    address: handleSubmitAddress,
    key: handleSubmitKey,
    encrypted: handleSubmitEncryptedKey,
    mnemonic: handleSubmitMnemonic,
  })

  const isMnemonic = actionData.inputType === 'mnemonic'
  const isTextMode = !!actionData.text
  const isSubmitDisabled = isTextMode ? !actionState.isValid : !backupFile

  const handleBrowseClick = async () => {
    const file = await handleBrowserFile()
    setBackupFile(file)
  }

  const handleScanQrCode = () => {
    QrCodeScanModalHelper.show({
      onScan: (data: string) => {
        if (!data) return
        handleChange(data)
      },
    })
  }

  const handleConfirmBackup = async () => {
    navigation.navigate('PasswordModal', {
      title: t('importBackupConfirmPassword.importBackupTitle'),
      buttonProps: {
        label: t('importBackupConfirmPassword.importBackupButtonLabel'),
        leftElement: <TbFileImport aria-hidden />,
      },
      inputProps: {
        label: t('importBackupConfirmPassword.backupPasswordLabel'),
        placeholder: t('importBackupConfirmPassword.backupPasswordPlaceholder'),
      },
      description: t('importBackupConfirmPassword.description'),
      async onConfirm(password) {
        const backupData = handleTryDecryptData(backupFile!, password)
        await handleImportBackupData(backupData)
      },
      onSuccess() {
        handleImportComplete()
      },
    })
  }

  const handleSubmitPress = isTextMode ? handleAct(data => handleSubmit(data, false)) : handleConfirmBackup

  useEffect(() => {
    if (actionData.text) {
      setBackupFile(undefined)
    }
  }, [actionData.text])

  useEffect(() => {
    if (backupFile) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backupFile])

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <View className="mb-8">
        <Text className="my-6 text-center font-sans-regular text-lg text-white">{t('importDescription')}</Text>

        <TwInput
          placeholder={t('importDetailsPlaceholder')}
          aria-label={t('importDetailsLabel')}
          value={actionData.text}
          onChangeText={handleChange}
          autoFocus={isMnemonic}
          className={StyleHelper.mergeStyles({
            'h-fit max-h-36 align-top': isMnemonic,
          })}
          actionsContainerProps={{
            className: StyleHelper.mergeStyles({
              'mt-2 items-start': isMnemonic,
            }),
          }}
          inputContainerProps={{
            className: StyleHelper.mergeStyles('bg-gray-900 items-start', {
              'border-magenta': !!actionState.errors.text,
            }),
          }}
          multiline={isMnemonic}
          pastable
          clearable
          autoCapitalize="none"
          submitBehavior="blurAndSubmit"
          autoComplete="off"
          autoCorrect={false}
        />

        {isMnemonic && (
          <View className="mb-3 mt-4 flex-row items-center justify-center gap-2.5">
            {actionState.errors.text ? (
              <TbX aria-hidden className="size-5 text-magenta" />
            ) : (
              <TbCheck aria-hidden className="size-5 text-neon" />
            )}

            <Text
              className={StyleHelper.mergeStyles('font-sans-regular text-base text-neon', {
                'text-magenta': actionState.errors.text,
              })}
            >
              {t(!actionState.errors.text ? 'messages.mnemonicComplete' : 'messages.mnemonicIncorrect')}
            </Text>
          </View>
        )}

        <TwButton
          label={t('scanButtonLabel')}
          variant="card"
          leftElement={<TbQrcode aria-hidden />}
          onPress={handleScanQrCode}
          className="mt-4"
        />
      </View>

      <TwSeparator />

      <View className="mt-8 gap-y-6">
        <Text className="text-center font-sans-regular text-lg text-gray-100">{t('backupImportDescription')}</Text>
        <TwButton
          label={t('locateButtonLabel')}
          variant="card"
          leftElement={<TbEyeSearch aria-hidden />}
          onPress={handleBrowseClick}
        />

        {backupFile && (
          <TwBanner className="mt-2" type="success">
            {t('messages.successFile')}
          </TwBanner>
        )}
      </View>

      <TwButton
        className="mb-3 mt-auto"
        variant="contained-light"
        label={tCommon('general.next')}
        disabled={isSubmitDisabled}
        onPress={handleSubmitPress}
        isLoading={actionState.isActing}
        rightElement={<TbArrowRight aria-hidden />}
      />
    </TwModalLayout>
  )
}
