import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { QrCodeScanModalHelper } from '@/helpers/QrCodeScanModalHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useImportAction } from '@/hooks/useImportAction'
import type { TUseImportFromFileResult } from '@/hooks/useImportFromFile'
import { useImportFromFile } from '@/hooks/useImportFromFile'
import { useNeonBackupFile } from '@/hooks/useNeonBackupFile'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'
import TbCheck from '@/assets/images/tb-check.svg'
import TbEyeSearch from '@/assets/images/tb-eye-search.svg'
import TbFileImport from '@/assets/images/tb-file-import.svg'
import TbQrcode from '@/assets/images/tb-qrcode.svg'
import TbX from '@/assets/images/tb-x.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingImportModal = ({ navigation, route }: TRootStackScreenProps<'OnboardingImportModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'onboardingImport' })
  const { t: tCommon } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { handleBrowse, isBrowsing } = useImportFromFile()
  const { handleTryDecryptData, handleGenerateData, handleImportBackupData } = useNeonBackupFile()

  const [importFile, setImportFile] = useState<TUseImportFromFileResult>()

  const handleImportComplete = async (popCount = 2) => {
    route.params.onConfirm()

    dispatch(settingsReducerActions.setIsFirstTime(false))

    AnalyticsHelper.logEvent('wallet_imported')

    navigation.pop(popCount)

    await UtilsHelper.sleep(1000)

    navigation.reset({ index: 0, routes: [{ name: 'OnboardingCompletedScreen', params: { isImport: true } }] })
  }

  const handleSubmitAddress = async (address: string) => {
    navigation.navigate('ImportAddressSelectionModal', { address, onSuccess: handleImportComplete })
  }

  const handleSubmitMnemonic = async (mnemonic: string) => {
    navigation.navigate('ImportMnemonicSelectionModal', {
      mnemonic,
      onSuccess: handleImportComplete,
    })
  }

  const handleSubmitKey = async (key: string) => {
    navigation.navigate('ImportKeySelectionModal', {
      key,
      onSuccess: handleImportComplete,
    })
  }

  const handleSubmitEncryptedKey = async (encryptedKey: string) => {
    navigation.navigate('ImportEncryptedKeySelectionModal', {
      encryptedKey,
      onSuccess: handleImportComplete,
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
  const isSubmitDisabled = isTextMode ? !actionState.isValid : !importFile

  const handleBrowseClick = async () => {
    if (importFile) {
      setImportFile(undefined)
    }

    try {
      const result = await handleBrowse()
      if (result) setImportFile(result)
    } catch (error) {
      LoggerHelper.error(error, { where: 'OnboardingImportModal', operation: 'handleBrowse' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handleScanQrCode = () => {
    QrCodeScanModalHelper.show({
      onScan: (data: string) => {
        if (!data) return
        handleChange(data)
      },
    })
  }

  const handleConfirmFile = () => {
    if (!importFile) return

    if (importFile.type === 'nep6') {
      navigation.navigate('Nep6BackupImportAccountSelectionModal', {
        content: importFile.content,
        onSuccess: () => handleImportComplete(3),
      })
      return
    }

    if (importFile.type === 'migrate') {
      navigation.navigate('MigrateFromNeon2AccountSelectionModal', {
        content: importFile.content,
        onSuccess: () => handleImportComplete(3),
      })
      return
    }

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
        const decryptedData = handleTryDecryptData(importFile.backupFile, password)
        const generatedData = handleGenerateData(decryptedData)

        await handleImportBackupData(generatedData)
      },
      onSuccess() {
        handleImportComplete()
      },
    })
  }

  const handleSubmitPress = isTextMode ? handleAct(data => handleSubmit(data, false)) : handleConfirmFile

  useEffect(() => {
    if (actionData.text) {
      setImportFile(undefined)
    }
  }, [actionData.text])

  useEffect(() => {
    if (importFile) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFile])

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      <ModalLayout.KeyboardAvoidingContent>
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

        <View className="mt-8 gap-y-3">
          <Text className="text-center font-sans-regular text-lg text-gray-100">{t('backupImportDescription')}</Text>
          <TwButton
            label={t('locateButtonLabel')}
            variant="card"
            className="mt-3"
            leftElement={<TbEyeSearch aria-hidden />}
            onPress={handleBrowseClick}
            isLoading={isBrowsing}
          />

          {importFile && <TwBanner type="success">{t(`${importFile.type}FileDetected`)}</TwBanner>}
        </View>

        <ModalLayout.KeyboardAvoidingArea>
          <TwButton
            className="mt-8"
            variant="contained-light"
            label={tCommon('general.next')}
            disabled={isSubmitDisabled}
            onPress={handleSubmitPress}
            isLoading={actionState.isActing}
            rightElement={<TbArrowRight aria-hidden />}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}
