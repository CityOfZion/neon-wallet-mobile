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

import { TwScreenLayout } from '@/layouts/TwScreenLayout'
import { TwScreenLayoutButton } from '@/layouts/TwScreenLayout/TwScreenLayoutButtons'

import TbCopy from '@/assets/images/tb-copy.svg'
import TbPrinter from '@/assets/images/tb-printer.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const SettingsWalletBackupStep1Screen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'SettingsWalletBackupStep1Screen'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'walletBackupStep1Screen' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
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
      title: t('dialog_title'),
      subtitle: t('dialog_body'),
      buttons: [
        {
          label: t('dialog_dismiss'),
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
    <TwScreenLayout
      title={t('title')}
      rightElement={<TwScreenLayoutButton onPress={navigation.goBack} label={commonT('cancel')} />}
    >
      {isMounting ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <Text className="font-sans-semibold text-base text-white">{wallet.name}</Text>

          <View className="mt-6 w-full flex-shrink flex-row items-center justify-between gap-2">
            <Text className="flex-shrink font-sans-semibold text-base text-white">{t('label_1')}</Text>
            <Text className="font-sans-bold text-base text-white">{t('oneOfThree')}</Text>
          </View>

          <Text className="mt-1 font-sans-regular text-base text-white">{t('body_1')}</Text>

          <View className="mt-6 flex-row flex-wrap gap-2">
            {words.map((word, index) => (
              <Text
                key={`mnemonic-${word}-${index}`}
                className="flex-grow rounded-md bg-gray-300/15 px-2 py-2 text-center font-sans-regular text-lg text-white"
              >
                {index + 1}. {word}
              </Text>
            ))}
          </View>

          <View className="flex-row justify-end">
            <TwIconButton icon={<TbCopy className="text-neon" aria-hidden />} onPress={handlePressCopy} />
            <TwIconButton icon={<TbPrinter className="text-neon" aria-hidden />} onPress={handlePressPrint} />
          </View>

          <Text className="mt-2.5 font-sans-regular text-base text-white">{t('body_2')}</Text>

          <Text className="mt-5 font-sans-regular text-base text-white">{t('body_3')}</Text>

          <View className="mt-auto py-3">
            <TwButton onPress={handlePressContinue} label={commonT('continue')} variant="contained-light" />
          </View>
        </Fragment>
      )}
    </TwScreenLayout>
  )
}
