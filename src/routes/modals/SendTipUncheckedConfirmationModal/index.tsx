import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { ModalLayout } from '@/layouts/ModalLayout'

import Fa6RegStar from '@/assets/images/fa6-regular-star.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SendTipUncheckedConfirmationModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'SendTipUncheckedConfirmationModal'>) => {
  const { onConfirmation } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'sendTipUncheckedConfirmation' })

  const handlePress = (value: boolean) => {
    navigation.goBack()
    onConfirmation(value)
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton onPress={navigation.goBack} />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent className="pt-4">
        <Image
          contentFit="contain"
          className="-mr-12 mb-2 h-52 w-auto"
          source={require('@/assets/images/neo-tipping-logo.png')}
        />

        <View className="mb-2 flex-row justify-center gap-x-2">
          <Fa6RegStar className="mt-0.5 size-6 text-neon" aria-hidden />
          <Text className="font-sans-medium text-1xl text-white">{t('subtitle')}</Text>
        </View>

        <Text className="text-center font-sans-light text-lg text-white">{t('description')}</Text>

        <View className="mb-4 mt-auto flex flex-col gap-4">
          <TwButton variant="contained-light" label={t('keepTipButtonLabel')} onPress={handlePress.bind(null, true)} />
          <TwButton variant="outline" label={t('removeTipButtonLabel')} onPress={handlePress.bind(null, false)} />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
