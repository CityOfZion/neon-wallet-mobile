import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwCheckbox } from '@/components/TwCheckbox'
import { TwMenuButton } from '@/components/TwMenuButton'

import { useIsGeneralSettingsDisabledSelector } from '@/hooks/useGeneralSettingsSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useShouldConfirmActionSelector } from '@/hooks/useSettingsSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import NeonWalletIcon from '@/assets/images/neon-wallet-icon.svg'
import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingCompletedScreen = ({
  navigation,
  route,
}: TRootStackScreenProps<'OnboardingCompletedScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'onboardingCompleted' })

  const { wallets } = useWalletsSelector()
  const dispatch = useAppDispatch()
  const { isGeneralSettingsDisabled } = useIsGeneralSettingsDisabledSelector()
  const { shouldConfirmAction } = useShouldConfirmActionSelector()

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

  const handleShouldConfirmActionChange = (isChecked: boolean) => {
    dispatch(settingsReducerActions.setShouldConfirmAction(isChecked))
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.ScrollContent contentContainerClassName="items-center px-6 pb-safe-or-8">
        <NeonWalletIcon aria-hidden className="mt-28 size-32 text-neon" />

        <Text className="mt-8 text-center font-sans-medium text-2xl text-neon">
          {isImport ? t('titleImport') : t('titleNew')}
        </Text>

        <Text className="mt-2 px-8 text-center font-sans-regular text-lg leading-6 text-white">
          {isImport ? t('subtitleImport') : t('subtitleNew')}
        </Text>

        <TwMenuButton
          disabled={isGeneralSettingsDisabled}
          label={t('shouldConfirmActionPasswordCheckboxLabel')}
          subtitle={
            <View pointerEvents={isGeneralSettingsDisabled ? 'none' : 'auto'}>
              <TwCheckbox
                checked={shouldConfirmAction}
                onCheckedChange={checked => handleShouldConfirmActionChange(checked)}
                label=""
              />
            </View>
          }
          onPress={() => handleShouldConfirmActionChange(!shouldConfirmAction)}
          rightElement={undefined}
        />

        <TwButton
          label={isImport ? t('viewWalletButtonLabel') : t('backupMnemonicButtonLabel')}
          className="mt-auto w-full"
          onPress={handlePressViewWallet}
          disabled={isDisabled}
          variant="contained-light"
          rightElement={isImport ? undefined : <TbDeviceFloppy aria-hidden />}
        />
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
