import React, { useLayoutEffect, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import type { TWalletCardRef } from '@/components/WalletCard'
import { WalletCard } from '@/components/WalletCard'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingCompletedScreen = ({
  navigation,
  route,
}: TRootStackScreenProps<'OnboardingCompletedScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'onboardingCompletedScreen' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { bottom } = useSafeAreaInsets()
  const { wallets } = useWalletsSelector()

  const ref = useRef<TWalletCardRef>(null)

  const wallet = wallets[0]

  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

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

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.runInAnimation()
    }
  }, [])

  return (
    <TwScreenLayout
      withoutBackButton
      withoutHeader
      withoutBars
      contentContainerClassName="items-center"
      contentContainerStyle={{ paddingBottom: Math.max(20, bottom) }}
    >
      <WalletCard ref={ref} wallet={wallet} withBalanceBar={false} width={200} className="mt-20" />

      <Text className="mt-8 text-center font-sans-medium text-3xl text-neon">{t('title')}</Text>

      <Text className="mt-2 px-12 text-center font-sans-regular text-lg leading-6 text-white">{t('subtitle')}</Text>

      <View className="mb-4 mt-11 w-full max-w-full rounded bg-gray-850 p-3">
        <Text className="font-sans-regular text-gray-300">{t('titleAddressList')}</Text>

        <View className="mt-3 gap-3">
          {accountsByWalletId.map(account => (
            <TouchableOpacity
              key={account.id}
              aria-label={tCommonGeneral('copy')}
              className="flex flex-row items-center gap-2"
              activeOpacity={0.6}
              onPress={() => ClipboardHelper.write(account.address)}
            >
              <TwBlockchainIcon blockchain={account.blockchain} className="h-4.5 w-4.5" />

              <Text
                className="flex-shrink flex-grow font-sans-regular text-neon"
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                {account.address}
              </Text>

              <TbCopy aria-hidden className="h-4 w-4 text-neon" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TwButton
        label={t('buttonLabel')}
        className="mt-auto w-full"
        onPress={handlePressViewWallet}
        disabled={isDisabled}
      />
    </TwScreenLayout>
  )
}
