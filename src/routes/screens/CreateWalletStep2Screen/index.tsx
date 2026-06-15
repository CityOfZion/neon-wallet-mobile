import React, { Fragment, useState } from 'react'

import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useFileSystem } from '@/hooks/useFileSystem'
import { useMount } from '@/hooks/useMount'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbCopy from '@/assets/images/tb-copy.svg'
import TbDownload from '@/assets/images/tb-download.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep2Screen = ({ navigation }: TMoreStackScreenProps<'CreateWalletStep2Screen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep2' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { writeFile } = useFileSystem()

  const [words, setWords] = useState<string[]>([])

  const mnemonic = words.join(' ')

  const handleContinue = () => {
    navigation.navigate('CreateWalletStep3Screen', {
      words,
    })
  }

  const handlePressContinue = () => {
    AlertHelper.show({
      title: t('dialogTitle'),
      subtitle: t('dialogBody'),
      buttons: [
        {
          label: t('dialogDismiss'),
          onPress: handleContinue,
        },
      ],
    })
  }

  const handlePressCopy = () => {
    ClipboardHelper.write(mnemonic)
  }

  const handlePressDownload = async () => {
    await writeFile(`NEON-mnemonic-${DateHelper.getNowUnix()}`, mnemonic, 'text/txt')

    ToastHelper.success({ message: tCommonGeneral('savedSuccessfully') })
  }

  const { isMounting } = useMount(() => {
    setWords(BSKeychainHelper.generateMnemonic().split(' '))
  }, [])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        {isMounting ? (
          <ScreenLoader />
        ) : (
          <Fragment>
            <View className="w-full flex-shrink flex-row items-center justify-between gap-2">
              <Text className="flex-shrink font-sans-semibold text-base text-white">{t('label')}</Text>
              <Text className="font-sans-bold text-base text-white">{t('oneOfThree')}</Text>
            </View>

            <Text className="mt-1 font-sans-regular text-base text-white">{t('body1')}</Text>

            <View className="mt-6 flex-row flex-wrap gap-2">
              {words.map((word, index) => (
                <Text
                  key={`mnemonic-${word}-${index}`}
                  className="flex-grow rounded-md bg-gray-300/15 p-2 text-center font-sans-regular text-lg text-white"
                >
                  {index + 1}. {word}
                </Text>
              ))}
            </View>

            <View className="flex-row items-center justify-end">
              <TwIconButton
                aria-label={tCommonGeneral('copy')}
                icon={<TbCopy className="text-neon" aria-hidden />}
                onPress={handlePressCopy}
              />

              <TwIconButton
                aria-label={tCommonGeneral('download')}
                icon={<TbDownload className="text-neon" aria-hidden />}
                onPress={handlePressDownload}
              />
            </View>

            <Text className="mt-2.5 font-sans-regular text-base text-white">{t('body2')}</Text>

            <Text className="mt-5 font-sans-regular text-base text-white">{t('body3')}</Text>

            <View className="mt-auto py-3">
              <TwButton label={tCommonGeneral('continue')} variant="contained-light" onPress={handlePressContinue} />
            </View>
          </Fragment>
        )}
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
