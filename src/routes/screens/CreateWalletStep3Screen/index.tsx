import { useMemo, useState } from 'react'

import shuffle from 'lodash/shuffle'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { TwButton } from '@/components/TwButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'
import { TwScreenLayoutButton } from '@/layouts/TwScreenLayout/TwScreenLayoutButtons'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep3Screen = ({ navigation, route }: TMoreStackScreenProps<'CreateWalletStep3Screen'>) => {
  const words = route.params.words

  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep3' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })

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
      title: t('dialog_1_title'),
      subtitle: t('dialog_1_body'),
      buttons: [
        {
          label: commonT('yes'),
          onPress: handleConfirmSkip,
        },
        { label: commonT('no') },
      ],
    })
  }

  const handlePressContinue = () => {
    const mountedPressedWords = pressedWordsIndex.map(wordIndex => shuffledWords[wordIndex]).join(' ')
    const mountedWords = words.join(' ')

    if (mountedPressedWords !== mountedWords) {
      AlertHelper.show({
        title: t('dialog_2_title'),
        subtitle: t('dialog_2_body'),
        buttons: [
          {
            label: commonT('retry'),
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
    <TwScreenLayout
      title={t('title')}
      rightElement={<TwScreenLayoutButton onPress={handleSkip} label={commonT('skip')} />}
    >
      <View className="w-full flex-shrink flex-row items-center justify-between gap-2">
        <Text className="flex-shrink font-sans-semibold text-base text-white">{t('label_1')}</Text>
        <Text className="font-sans-bold text-base text-white">{t('twoOfThree')}</Text>
      </View>

      <Text className="mt-1 font-sans-regular text-base text-white">{t('body_1')}</Text>

      <View className="mt-6 flex-row flex-wrap gap-2">
        {shuffledWords.map((word, index) => {
          const isWordPressed = pressedWordsIndex.some(pressedWord => pressedWord === index)

          return (
            <PressableScale
              onPress={handlePressWord.bind(null, index, isWordPressed)}
              key={`mnemonic-${word}-${index}`}
              className={StyleHelper.mergeStyles('flex-grow rounded-md bg-gray-300/15 px-2 py-2', {
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
          label={commonT('continue')}
          disabled={pressedWordsIndex.length !== words.length}
          onPress={handlePressContinue}
        />
      </View>
    </TwScreenLayout>
  )
}
