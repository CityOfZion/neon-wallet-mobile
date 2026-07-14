import { useEffect } from 'react'

import { Keyboard, Text, TextInput, View } from 'react-native'

import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useActions } from '@/hooks/useActions'

import TbCheck from '@/assets/images/tb-check.svg'

import { TwInput } from './TwInput'

import type { TUseImportNep6Account } from '@/types/hooks'

type TProps = {
  account: TUseImportNep6Account
  inputLabel: string
  inputPlaceholder: string
  error: string
  onSubmit: (account: TUseImportNep6Account, password: string) => Promise<void>
}

type TActionsData = {
  password: string
}

export const ImportPasswordRow = ({ account, inputLabel, inputPlaceholder, error, onSubmit }: TProps) => {
  const { actionData, actionState, setDataWrapper, setError, handleAct } = useActions<TActionsData>({ password: '' })

  const isSuccess = actionState.hasActed && actionState.isValid

  const handleSubmit = async (data: TActionsData) => {
    try {
      await onSubmit(account, data.password)
    } catch (submitError) {
      LoggerHelper.error(submitError, { where: 'ImportPasswordRow', operation: 'submitAccountPassword' })
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
      <Text className="font-sans-medium text-sm text-white">{account.label}</Text>
      <Text className="mb-2 font-sans-regular text-sm text-gray-300" numberOfLines={1} ellipsizeMode="middle">
        {account.address}
      </Text>

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
