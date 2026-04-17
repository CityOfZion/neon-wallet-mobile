import { useEffect, useLayoutEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useImportAction } from '@/hooks/useImportAction'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbCheck from '@/assets/images/tb-check.svg'
import TbX from '@/assets/images/tb-x.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const ImportScreen = ({ navigation, route }: TMoreStackScreenProps<'ImportScreen'>) => {
  const data = route.params?.data

  const { t } = useTranslation('screens', { keyPrefix: 'import' })
  const { t: tCommon } = useTranslation('common')

  const handleNavigateToWalletsScreen = () => {
    navigation.replace('TabStack', { screen: 'WalletsStack', params: { screen: 'WalletsScreen' } })
  }

  const handleSubmitAddress = async (address: string) => {
    navigation.navigate('ImportAddressSelectionModal', {
      address,
      onSuccess: handleNavigateToWalletsScreen,
    })
  }

  const handleSubmitEncryptedKey = async (encryptedKey: string) => {
    navigation.navigate('ImportEncryptedKeySelectionModal', {
      encryptedKey,
      onSuccess: handleNavigateToWalletsScreen,
    })
  }

  const handleSubmitKey = async (key: string) => {
    navigation.navigate('ImportKeySelectionModal', {
      key,
      onSuccess: handleNavigateToWalletsScreen,
    })
  }

  const handleSubmitMnemonic = async (mnemonic: string) => {
    navigation.navigate('ImportMnemonicSelectionModal', {
      mnemonic,
      onSuccess: handleNavigateToWalletsScreen,
    })
  }

  const { actionData, actionDataRef, actionState, actionStateRef, handleSubmit, handleAct, handleChange } =
    useImportAction({
      address: handleSubmitAddress,
      key: handleSubmitKey,
      encrypted: handleSubmitEncryptedKey,
      mnemonic: handleSubmitMnemonic,
    })

  const isMnemonic = actionData.inputType === 'mnemonic'

  useLayoutEffect(() => {
    if (!data) return

    handleChange(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (actionStateRef.current.isValid && !!actionDataRef.current.text && !!actionDataRef.current.inputType) {
      handleAct(handleSubmit.bind(null, actionDataRef.current, false))()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>

      <ScreenLayout.KeyboardAvoidingContent>
        <Text className="m-10 text-center font-sans-regular text-lg text-white">{t('enterAnAddress')}</Text>

        {isMnemonic && (
          <View className="mb-5 flex-row items-center justify-center gap-2.5">
            {actionState.errors.text ? (
              <TbX aria-hidden className="size-5 text-magenta" />
            ) : (
              <TbCheck aria-hidden className="size-5 text-neon" />
            )}

            <Text
              className={StyleHelper.mergeStyles('font-sans-regular text-base text-neon', {
                'text-magenta': !!actionState.errors.text,
              })}
            >
              {t(!actionState.errors.text ? 'mnemonicComplete' : 'mnemonicIncorrect')}
            </Text>
          </View>
        )}

        <TwInput
          placeholder={t('placeholder')}
          value={actionData.text}
          onChangeText={handleChange}
          autoFocus={isMnemonic}
          className={StyleHelper.mergeStyles({
            'h-36 max-h-36 align-top': isMnemonic,
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
          scannable
          autoCapitalize="none"
          submitBehavior="blurAndSubmit"
          autoComplete="off"
          autoCorrect={false}
        />

        <ScreenLayout.KeyboardAvoidingArea>
          <TwButton
            variant="contained-light"
            label={tCommon('general.next')}
            disabled={!actionState.isValid}
            onPress={handleAct(handleSubmit)}
          />
        </ScreenLayout.KeyboardAvoidingArea>
      </ScreenLayout.KeyboardAvoidingContent>
    </ScreenLayout.Root>
  )
}
