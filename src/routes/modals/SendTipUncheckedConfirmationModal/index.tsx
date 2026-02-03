import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import Fa6RegStar from '@/assets/images/fa6-regular-star.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SendTipUncheckedConfirmationModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'SendTipUncheckedConfirmationModal'>) => {
  const { onConfirmation } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'sendTipUncheckedConfirmationModal' })

  const handlePress = (value: boolean) => {
    navigation.goBack()
    onConfirmation(value)
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton onPress={navigation.goBack} />}>
      <Image contentFit="contain" className="-mr-12 h-52" source={require('@/assets/images/neo-tipping-logo.png')} />

      <View className="mb-4 flex-row justify-center gap-x-2">
        <Fa6RegStar className="size-6 text-neon" aria-hidden />
        <Text className="font-sans-medium text-1xl text-white">{t('subtitle')}</Text>
      </View>

      <Text className="text-center font-sans-light text-lg text-white">{t('description')}</Text>

      <View className="mb-2 mt-auto flex flex-col gap-6">
        <TwButton variant="contained-light" label={t('keepTip')} onPress={handlePress.bind(null, true)} />
        <TwButton variant="contained-light" label={t('removeTip')} onPress={handlePress.bind(null, false)} />
      </View>
    </TwModalLayout>
  )
}
