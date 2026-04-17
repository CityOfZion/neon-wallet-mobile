import { Keyboard, Text, View } from 'react-native'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { AppError } from '@/helpers/ErrorHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  password: string
}

export const PasswordModal = ({ route, navigation }: TRootStackScreenProps<'PasswordModal'>) => {
  const { title, description, inputProps, buttonProps, bannerProps, onConfirm, onError, onRequestClose, onSuccess } =
    route.params

  const { actionData, actionState, handleAct, setError, setDataWrapper } = useActions<TActionData>({
    password: '',
  })

  const handlePress = async () => {
    try {
      Keyboard.dismiss()
      await UtilsHelper.sleep(500)
      await onConfirm(actionData.password)
      navigation.goBack()
      await UtilsHelper.sleep(500)
      await onSuccess()
    } catch (error: any) {
      setError('password', AppError.wrap(error).message)
      await onError?.(error)
    }
  }

  const handleClose = () => {
    navigation.goBack()
    onRequestClose?.()
  }

  return (
    <ModalLayout.Root onRequestClose={handleClose}>
      <ModalLayout.Header>
        <ModalLayout.Title>{title}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={handleClose} />
      </ModalLayout.Header>

      <ModalLayout.KeyboardAvoidingContent>
        {description && <Text className="mb-6 font-sans-regular text-lg text-white">{description}</Text>}

        <TwInput
          secureTextEntry
          value={actionData.password}
          onChangeText={setDataWrapper('password')}
          disabled={actionState.isActing}
          {...inputProps}
        />

        {actionState.errors.password && <TwAlertErrorBanner className="mt-2.5" message={actionState.errors.password} />}

        <View className="mt-auto pt-7">{bannerProps && <TwBanner {...bannerProps} />}</View>

        <ModalLayout.KeyboardAvoidingArea className="pt-7">
          <TwButton
            {...buttonProps}
            variant="contained-light"
            onPress={handleAct(handlePress)}
            disabled={!actionState.isValid}
            isLoading={actionState.isActing}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}
