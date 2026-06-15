import { useMemo, useState } from 'react'

import shuffle from 'lodash/shuffle'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const SettingsWalletBackupStep2Screen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'SettingsWalletBackupStep2Screen'>) => {
  const { wallet, words } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'walletBackupStep2' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const shuffledWords = useMemo(() => shuffle(words), [words])

  const [pressedWordsIndex, setPressedWordsIndex] = useState<number[]>([])

  const handlePressWord = (wordIndex: number, isWordPressed: boolean) => {
    setPressedWordsIndex(prevState =>
      isWordPressed ? prevState.filter(state => state !== wordIndex) : [...prevState, wordIndex]
    )
  }

  const handlePressContinue = async () => {
    const mountedPressedWords = pressedWordsIndex.map(wordIndex => shuffledWords[wordIndex]).join(' ')
    const mountedWords = words.join(' ')

    if (mountedPressedWords !== mountedWords) {
      ToastHelper.error({ message: t('errors.incorrectWordOrder') })
      setPressedWordsIndex([])
      return
    }

    navigation.navigate('SettingsWalletBackupStep3Screen', {
      wallet,
    })
  }

  const handlePressCancel = () => {
    navigation.pop(2)
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.Button position="right" onPress={handlePressCancel} label={tCommonGeneral('cancel')} />
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <Text className="font-sans-semibold text-base text-white">{wallet.name}</Text>

        <View className="mt-6 w-full flex-shrink flex-row items-center justify-between gap-2">
          <Text className="flex-shrink font-sans-semibold text-base text-white">{t('description')}</Text>
          <Text className="font-sans-bold text-base text-white">{t('twoOfThree')}</Text>
        </View>

        <Text className="mt-1 font-sans-regular text-base text-white">{t('body')}</Text>

        <View className="mt-6 flex-row flex-wrap gap-2">
          {shuffledWords.map((word, index) => {
            const isWordPressed = pressedWordsIndex.some(pressedWord => pressedWord === index)

            return (
              <PressableScale
                onPress={handlePressWord.bind(null, index, isWordPressed)}
                key={`mnemonic-${word}-${index}`}
                className={StyleHelper.mergeStyles('flex-grow rounded-md bg-gray-300/15 p-2', {
                  'bg-neon': isWordPressed,
                })}
              >
                <Text
                  key={`mnemonic-${word}-${index}`}
                  className={StyleHelper.mergeStyles('text-center font-sans-regular text-lg text-neon', {
                    'text-gray-850': isWordPressed,
                  })}
                >
                  {word}
                </Text>
              </PressableScale>
            )
          })}
        </View>

        <View className="mt-auto py-3">
          <TwButton
            variant="contained-light"
            label={tCommonGeneral('continue')}
            disabled={pressedWordsIndex.length !== words.length}
            onPress={handlePressContinue}
          />
        </View>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
