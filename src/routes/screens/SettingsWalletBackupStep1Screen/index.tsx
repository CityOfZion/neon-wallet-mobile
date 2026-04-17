import { Fragment, useState } from 'react'

import * as Print from 'expo-print'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'

import { useMount } from '@/hooks/useMount'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbCopy from '@/assets/images/tb-copy.svg'
import TbPrinter from '@/assets/images/tb-printer.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const SettingsWalletBackupStep1Screen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'SettingsWalletBackupStep1Screen'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'walletBackupStep1' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const [mnemonic, setMnemonic] = useState<string>('')

  const words = mnemonic.split(' ')

  const handlePressCopy = () => {
    if (!mnemonic) return

    ClipboardHelper.write(mnemonic)
  }

  const handlePressPrint = () => {
    Print.printAsync({
      html: `<html lang="en-US"><body><br><br>&emsp;&emsp;${mnemonic}</body></html>`,
    })
  }

  const handleConfirmContinue = () => {
    navigation.navigate('SettingsWalletBackupStep2Screen', {
      wallet,
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
          onPress: handleConfirmContinue,
        },
      ],
    })
  }

  const { isMounting } = useMount(async () => {
    const walletMnemonic = await SecureStoreHelper.getMnemonic(wallet)

    setMnemonic(walletMnemonic || '')
  }, [])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.Button position="right" onPress={navigation.goBack} label={tCommonGeneral('cancel')} />
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        {isMounting ? (
          <ScreenLoader />
        ) : (
          <Fragment>
            <Text className="font-sans-semibold text-base text-white">{wallet.name}</Text>

            <View className="mt-6 w-full flex-shrink flex-row items-center justify-between gap-2">
              <Text className="flex-shrink font-sans-semibold text-base text-white">{t('description')}</Text>
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

            <View className="flex-row justify-end">
              <TwIconButton
                aria-label={t('copyButtonLabel')}
                icon={<TbCopy className="text-neon" aria-hidden />}
                onPress={handlePressCopy}
              />
              <TwIconButton
                aria-label={t('printButtonLabel')}
                icon={<TbPrinter className="text-neon" aria-hidden />}
                onPress={handlePressPrint}
              />
            </View>

            <Text className="mt-2.5 font-sans-regular text-base text-white">{t('body2')}</Text>

            <Text className="mt-5 font-sans-regular text-base text-white">{t('body3')}</Text>

            <View className="mt-auto py-3">
              <TwButton onPress={handlePressContinue} label={tCommonGeneral('continue')} variant="contained-light" />
            </View>
          </Fragment>
        )}
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
