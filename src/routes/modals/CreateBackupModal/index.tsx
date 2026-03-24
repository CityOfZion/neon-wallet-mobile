import { useEffect } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'

import { useActions } from '@/hooks/useActions'
import { useNeonCreateBackup } from '@/hooks/useNeonBackup'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

import { CreateBackupModalSuccessContent } from './CreateBackupModalSuccessContent'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  password: string
  confirmPassword: string
}

export const CreateBackupModal = ({ navigation }: TRootStackScreenProps<'CreateBackupModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'createBackupModal' })
  const { handleCreateBackup } = useNeonCreateBackup()

  const { actionData, actionState, setData, setError, clearErrors, handleAct } = useActions<TActionData>(
    {
      password: '',
      confirmPassword: '',
    },
    { clearErrorsOnChange: false }
  )

  const handleSubmit = async () => {
    await handleCreateBackup(actionData.password)

    AnalyticsHelper.logEvent('backup_done')

    navigation.navigate('SuccessModal', {
      title: t('title'),
      content: <CreateBackupModalSuccessContent password={actionData.password} />,
      buttonLabel: t('successModal.submitButtonLabel'),
    })
  }

  const handleChangePassword = (value: string) => {
    setData({ password: value.trim() })
  }

  const handleChangeConfirmPassword = (value: string) => {
    setData({ confirmPassword: value.trim() })
  }

  useEffect(() => {
    if (!actionData.password || !actionData.confirmPassword) return

    if (actionData.password !== actionData.confirmPassword) {
      setError('confirmPassword', t('errors.passwordsDoNotMatch'))
      return
    }

    clearErrors()
  }, [actionData.confirmPassword, actionData.password, setError, clearErrors, t])

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton />}
      contentContainerClassName="justify-between"
    >
      <View>
        <Text className="font-sans-regular text-lg text-white">{t('description')}</Text>

        <TwSeparator className="my-7" />

        <Text className="font-sans-regular text-lg text-white">{t('passwordDescription')}</Text>

        <TwInput
          containerProps={{ className: 'mt-7' }}
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          value={actionData.password}
          onChangeText={handleChangePassword}
          secureTextEntry
          disabled={actionState.isActing}
        />

        <TwInput
          containerProps={{ className: 'mt-6' }}
          label={t('confirmPasswordLabel')}
          placeholder={t('confirmPasswordPlaceholder')}
          value={actionData.confirmPassword}
          onChangeText={handleChangeConfirmPassword}
          secureTextEntry
          disabled={actionState.isActing}
        />

        {actionState.errors.confirmPassword && (
          <TwAlertErrorBanner className="mt-2.5" message={actionState.errors.confirmPassword} />
        )}
      </View>

      <View className="mt-7 gap-7">
        <TwBanner type="warningOrange">
          <Text className="flex-shrink px-5 py-3.5 font-sans-regular text-lg text-white">
            <Trans t={t} i18nKey="keepSafeAlertMessage">
              start
              <Text className="text-orange">middle</Text>
            </Trans>
          </Text>
        </TwBanner>

        <TwSeparator />

        <TwButton
          label={t('submitButtonLabel')}
          variant="contained-light"
          rightElement={<TbDeviceFloppy aria-hidden />}
          onPress={handleAct(handleSubmit)}
          isLoading={actionState.isActing}
          disabled={!actionState.isValid}
        />
      </View>
    </TwModalLayout>
  )
}
