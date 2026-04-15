import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep6Screen = ({ navigation, route }: TMoreStackScreenProps<'CreateWalletStep6Screen'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep6' })

  const handlePressContinue = () => {
    navigation.popToTop()
    navigation.jumpTo('WalletsStack', { screen: 'WalletScreen', params: { wallet } })
  }

  return (
    <TwScreenLayout title={t('title')}>
      <Image source={require('@/assets/images/logo-3d.png')} className="h-64" contentFit="contain" />

      <Text className="text-center font-sans-bold text-xl text-white">{t('label_1')}</Text>

      <Text className="mt-3 text-center font-sans-regular text-base text-white">{t('body_1')}</Text>

      <Text className="mt-3 text-center font-sans-regular text-base text-white">{t('body_2')}</Text>

      <View className="mt-auto py-3">
        <TwButton variant="contained-light" label={t('viewWallet')} onPress={handlePressContinue} />
      </View>
    </TwScreenLayout>
  )
}
