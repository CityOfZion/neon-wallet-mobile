import { Fragment, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Keyboard, Text, View } from 'react-native'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  password: string
  confirmPassword: string
}

export const CreatePasswordModal = ({ navigation, route }: TRootStackScreenProps<'CreatePasswordModal'>) => {
  const {
    onCreate,
    onSuccess,
    onError,
    title,
    bannerProps,
    buttonProps,
    confirmPasswordInputProps,
    description,
    formDescription,
    passwordInputProps,
    onRequestClose,
  } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'createPasswordModal' })

  const { actionData, actionState, setData, setError, clearErrors, handleAct } = useActions<TActionData>(
    {
      password: '',
      confirmPassword: '',
    },
    { clearErrorsOnChange: false }
  )

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss()
      await UtilsHelper.sleep(500)
      await onCreate(actionData.password)
      navigation.goBack()
      await UtilsHelper.sleep(500)
      await onSuccess()
    } catch (error) {
      await onError?.(error as Error)
    }
  }

  const handleChangePassword = (value: string) => {
    setData({ password: value.trim() })
  }

  const handleChangeConfirmPassword = (value: string) => {
    setData({ confirmPassword: value.trim() })
  }

  const handleClose = () => {
    navigation.goBack()
    onRequestClose?.()
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
      title={title}
      rightElement={<TwModalLayoutCloseIconButton onPress={handleClose} />}
      contentContainerClassName="justify-between"
      onRequestClose={handleClose}
    >
      <View>
        {description && (
          <Fragment>
            <Text className="font-sans-regular text-lg text-white">{description}</Text>

            <TwSeparator className="my-7" />
          </Fragment>
        )}

        {formDescription && <Text className="mb-7 font-sans-regular text-lg text-white">{formDescription}</Text>}

        <TwInput
          {...passwordInputProps}
          value={actionData.password}
          onChangeText={handleChangePassword}
          secureTextEntry
          disabled={actionState.isActing}
        />

        <TwInput
          {...confirmPasswordInputProps}
          containerProps={{ className: 'mt-6' }}
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
        {bannerProps && <TwBanner {...bannerProps} />}

        <TwButton
          {...buttonProps}
          variant="contained-light"
          onPress={handleAct(handleSubmit)}
          isLoading={actionState.isActing}
          disabled={!actionState.isValid}
        />
      </View>
    </TwModalLayout>
  )
}
