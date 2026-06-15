import React, { Fragment, useMemo } from 'react'

import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'
import { WalletCardIcon } from '@/components/WalletCardIcon'

import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useStandardWalletsSelector } from '@/hooks/useWalletSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbCheck from '@/assets/images/tb-check.svg'
import TbChevronRight from '@/assets/images/tb-chevron-right.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'
import type { TWallet } from '@/types/store'

type TItem = {
  wallet: TWallet
  onPress: () => Promise<void>
  success: boolean
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <TwButton
      onPress={item.success ? undefined : item.onPress}
      disabled={item.success}
      variant="card"
      leftElement={<WalletCardIcon wallet={item.wallet} />}
      iconsOnEdge
      label={item.wallet.name}
      rightElement={item.success ? <TbCheck aria-hidden /> : <TbChevronRight aria-hidden />}
      className="h-16 opacity-100"
      labelProps={{ className: 'text-left' }}
      contentProps={{ className: 'px-4' }}
    />
  )
}

export const SettingsSecurityBackupScreen = ({ navigation }: TMoreStackScreenProps<'SettingsSecurityBackupScreen'>) => {
  const { wallets } = useStandardWalletsSelector()
  const { t } = useTranslation('screens', { keyPrefix: 'settingsSecurityBackup' })
  const { authenticate } = useAuthentication()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const walletsToBackup = useMemo(() => wallets.filter(wallet => wallet.backupStatus !== 'successful'), [])

  const success = wallets.every(wallet => wallet.backupStatus === 'successful')

  const items: TItem[] = walletsToBackup.map(wallet => ({
    wallet,
    onPress: async () => {
      try {
        await authenticate()

        navigation.navigate('SettingsWalletBackupStep1Screen', {
          wallet,
        })
      } catch (error) {
        LoggerHelper.error(error, { where: 'SettingsSecurityBackupScreen', operation: 'handlePressItem' })
        ToastHelper.error({ message: AppError.wrap(error).message })
      }
    },
    success,
  }))

  const handleSuccessContinue = () => {
    navigation.goBack()
    navigation.navigate('SecuritySelectionModal')
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton
          onPress={() => {
            navigation.navigate('TabStack', {
              screen: 'MoreStack',
              params: { screen: 'MoreScreen' },
            })
          }}
        />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent className="px-0">
        <FlatList
          data={items}
          className="flex-1"
          contentContainerClassName="flex-1 gap-2 px-5"
          ListHeaderComponent={
            <View className="items-center">
              {success ? (
                <Fragment>
                  <Image className="size-40" source={require('@/assets/images/backup-info-feature.png')} />
                  <Text className="px-8 text-center font-sans-bold text-lg text-neon">
                    {t('withoutAccountsToBackup.description')}
                  </Text>
                  <TwSeparator className="mt-16" />
                </Fragment>
              ) : (
                <Fragment>
                  <TbAlertTriangleFilled className="size-12 text-neon" aria-hidden />

                  <Text className="mt-6 text-center font-sans-bold text-lg text-white">
                    {t('withAccountsToBackup.description1')}
                  </Text>

                  <Text className="mt-6 text-center font-sans-regular text-lg text-white">
                    {t('withAccountsToBackup.description2')}
                  </Text>

                  <Text className="mt-14 text-center font-sans-bold text-lg text-neon">
                    {t('withAccountsToBackup.description3')}
                  </Text>

                  <Text className="mb-4 mt-2 text-center font-sans-regular text-base text-gray-300">
                    {t('withAccountsToBackup.description4')}
                  </Text>
                </Fragment>
              )}
            </View>
          }
          ListFooterComponent={
            success ? (
              <TwButton
                onPress={handleSuccessContinue}
                className="mt-8"
                label={t('withoutAccountsToBackup.button_label')}
              />
            ) : undefined
          }
          renderItem={renderItem}
        />
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}
