import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TwButton } from '@/components/TwButton'

import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import NeonWalletIcon from '@/assets/images/neon-wallet-icon.svg'
import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingCompletedScreen = ({
  navigation,
  route,
}: TRootStackScreenProps<'OnboardingCompletedScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'onboardingCompleted' })

  const { bottom } = useSafeAreaInsets()
  const { wallets } = useWalletsSelector()

  const wallet = wallets[0]

  const isImport = route.params?.isImport
  const isDisabled = wallet.backupStatus === 'successful' && !isImport

  const handlePressViewWallet = () => {
    if (wallet && !isImport) {
      navigation.navigate('OnboardingBackupMnemonicModal', {
        wallet,
        onSuccess: () => {
          navigation.replace('TabStack', {
            screen: 'WalletsStack',
            params: {
              screen: 'WalletsScreen',
            },
          })
        },
      })
      return
    }

    navigation.replace('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'WalletsScreen',
      },
    })
  }

  return (
    <TwScreenLayout
      withoutBackButton
      withoutHeader
      withoutBars
      contentContainerClassName="items-center px-6"
      contentContainerStyle={{ paddingBottom: Math.max(32, bottom) }}
    >
      <NeonWalletIcon aria-hidden className="mt-28 size-32 text-neon" />

      <Text className="mt-8 text-center font-sans-medium text-2xl text-neon">
        {isImport ? t('titleImport') : t('titleNew')}
      </Text>

      <Text className="mt-2 px-8 text-center font-sans-regular text-lg leading-6 text-white">
        {isImport ? t('subtitleImport') : t('subtitleNew')}
      </Text>

      <TwButton
        label={isImport ? t('viewWalletButtonLabel') : t('backupMnemonicButtonLabel')}
        className="mt-auto w-full"
        onPress={handlePressViewWallet}
        disabled={isDisabled}
        variant="contained-light"
        rightElement={isImport ? undefined : <TbDeviceFloppy aria-hidden />}
      />
    </TwScreenLayout>
  )
}
