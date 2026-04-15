import { useEffect } from 'react'

import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { useAppDispatch } from '@/hooks/useRedux'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TMoreStackScreenProps } from '@/types/stacks'

export const SettingsWalletBackupStep3Screen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'SettingsWalletBackupStep3Screen'>) => {
  const { wallet } = route.params

  const dispatch = useAppDispatch()
  const { t } = useTranslation('screens', { keyPrefix: 'walletBackupStep3' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })

  const handlePress = () => {
    navigation.goBack()
    navigation.goBack()
    navigation.goBack()
  }

  useEffect(() => {
    dispatch(walletReducerActions.saveWallet({ ...wallet, backupStatus: 'successful' }))
  }, [dispatch, wallet])

  return (
    <TwScreenLayout title={t('title')}>
      <Image source={require('@/assets/images/logo-3d.png')} className="h-64" contentFit="contain" />

      <Text className="text-center font-sans-bold text-xl text-white">{t('label_1')}</Text>

      <View className="mt-auto py-3">
        <TwButton variant="contained-light" label={commonT('continue')} onPress={handlePress} />
      </View>
    </TwScreenLayout>
  )
}
