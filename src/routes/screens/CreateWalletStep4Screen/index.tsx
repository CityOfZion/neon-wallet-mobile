import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { StringHelper } from '@/helpers/StringHelper'

import { useActions } from '@/hooks/useActions'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

type TActionsData = {
  name: string
}

export const CreateWalletStep4Screen = ({ navigation, route }: TMoreStackScreenProps<'CreateWalletStep4Screen'>) => {
  const { mnemonic, hasBackup } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep4' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { actionData, actionState, setData, setError, handleAct } = useActions<TActionsData>({ name: '' })

  const handleChangeName = (name: string) => {
    setData({ name: StringHelper.removeSpecialCharacters(name, { removeDoubleSpaces: true }) })
  }

  const handleSubmit = () => {
    const trimmedName = StringHelper.removeSpecialCharacters(actionData.name, { trimText: true })

    if (trimmedName.length > 20 || trimmedName.length === 0) {
      setError('name', t('errors.name'))
      return
    }

    navigation.navigate('CreateWalletStep5Screen', {
      mnemonic,
      hasBackup,
      name: StringHelper.removeSpecialCharacters(actionData.name, { trimText: true, removeDoubleSpaces: true }),
    })
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>

      <ScreenLayout.KeyboardAvoidingContent>
        <View className="w-full flex-shrink flex-row items-center justify-between gap-2">
          <Text className="flex-shrink font-sans-semibold text-base text-white">{t('label')}</Text>
          <Text className="font-sans-bold text-base text-white">{t('threeOfThree')}</Text>
        </View>

        <Text className="mt-1 font-sans-regular text-base text-white">{t('body1')}</Text>

        <TwInput
          placeholder={t('labelWalletName')}
          containerProps={{ className: 'mt-6' }}
          inputContainerProps={{ className: 'bg-gray-900' }}
          value={actionData.name}
          error={actionState.errors.name}
          onChangeText={handleChangeName}
        />

        <ScreenLayout.KeyboardAvoidingArea>
          <TwButton
            variant="contained-light"
            label={tCommonGeneral('continue')}
            className="mb-2"
            disabled={actionState.isActing || !actionState.isValid}
            isLoading={actionState.isActing}
            onPress={handleAct(handleSubmit)}
          />
        </ScreenLayout.KeyboardAvoidingArea>
      </ScreenLayout.KeyboardAvoidingContent>
    </ScreenLayout.Root>
  )
}
