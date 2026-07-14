import { useEffect } from 'react'

import { Keyboard, TextInput, View } from 'react-native'

import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useActions } from '@/hooks/useActions'

import TbCheck from '@/assets/images/tb-check.svg'

import { TwInput } from './TwInput'

type TProps = {
  inputLabel: string
  inputPlaceholder: string
  error: string
  onSubmit: (password: string) => Promise<void>
}

type TActionsData = {
  password: string
}

export const ImportSharedPassword = ({ inputLabel, inputPlaceholder, error, onSubmit }: TProps) => {
  const { actionData, actionState, setDataWrapper, setError, handleAct } = useActions<TActionsData>({ password: '' })

  const isSuccess = actionState.hasActed && actionState.isValid

  const handleSubmit = async (data: TActionsData) => {
    try {
      await onSubmit(data.password)
    } catch (submitError) {
      LoggerHelper.error(submitError, { where: 'ImportSharedPassword', operation: 'submitSharedPassword' })
      setError('password', error)
    }
  }

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      const focusedInput = TextInput.State.currentlyFocusedInput()
      if (focusedInput) TextInput.State.blurTextInput(focusedInput)
    })

    return () => subscription.remove()
  }, [])

  return (
    <View className="py-2">
      <TwInput
        label={inputLabel}
        placeholder={inputPlaceholder}
        secureTextEntry
        value={actionData.password}
        onChangeText={setDataWrapper('password')}
        onBlur={handleAct(handleSubmit)}
        error={actionState.errors.password}
        loading={actionState.isActing}
        editable={!isSuccess && !actionState.isActing}
        rightElement={isSuccess ? <TbCheck aria-hidden className="size-5 text-neon" /> : undefined}
        submitBehavior="blurAndSubmit"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
    </View>
  )
}
