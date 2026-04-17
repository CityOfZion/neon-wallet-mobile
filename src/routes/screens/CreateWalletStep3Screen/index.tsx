import { useMemo, useState } from 'react'

import shuffle from 'lodash/shuffle'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { TwButton } from '@/components/TwButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep3Screen = ({ navigation, route }: TMoreStackScreenProps<'CreateWalletStep3Screen'>) => {
  const words = route.params.words

  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep3' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const shuffledWords = useMemo(() => shuffle(words), [words])

  const [pressedWordsIndex, setPressedWordsIndex] = useState<number[]>([])

  const handleConfirmSkip = () => {
    navigation.navigate('CreateWalletStep4Screen', {
      hasBackup: false,
      mnemonic: words.join(' '),
    })
  }

  const handleSkip = () => {
    AlertHelper.show({
      title: t('dialog1Title'),
      subtitle: t('dialog1Body'),
      buttons: [
        {
          label: tCommonGeneral('yes'),
          onPress: handleConfirmSkip,
        },
        { label: tCommonGeneral('no') },
      ],
    })
  }

  const handlePressContinue = () => {
    const mountedPressedWords = pressedWordsIndex.map(wordIndex => shuffledWords[wordIndex]).join(' ')
    const mountedWords = words.join(' ')

    if (mountedPressedWords !== mountedWords) {
      AlertHelper.show({
        title: t('dialog2Title'),
        subtitle: t('dialog2Body'),
        buttons: [
          {
            label: tCommonGeneral('retry'),
            onPress: () => {
              setPressedWordsIndex([])
            },
          },
        ],
      })
      return
    }

    navigation.navigate('CreateWalletStep4Screen', {
      hasBackup: true,
      mnemonic: words.join(' '),
    })
  }

  const handlePressWord = (wordIndex: number, isWordPressed: boolean) => {
    setPressedWordsIndex(prevState =>
      isWordPressed ? prevState.filter(state => state !== wordIndex) : [...prevState, wordIndex]
    )
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.Button position="right" onPress={handleSkip} label={tCommonGeneral('skip')} />
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <View className="w-full flex-shrink flex-row items-center justify-between gap-2">
          <Text className="flex-shrink font-sans-semibold text-base text-white">{t('label')}</Text>
          <Text className="font-sans-bold text-base text-white">{t('twoOfThree')}</Text>
        </View>

        <Text className="mt-1 font-sans-regular text-base text-white">{t('body1')}</Text>

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
