import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

export const BackupAlertModal = ({ navigation, route }: TRootStackScreenProps<'BackupAlertModal'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'backupAlertModal' })

  const handlePress = () => {
    navigation.replace('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'SettingsWalletBackupStep1Screen',
        params: { wallet },
      },
      initial: false,
    })
  }

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton />}
      contentContainerClassName="items-center"
    >
      <Image className="h-44 w-44" source={require('@/assets/images/backup-info-feature.png')} contentFit="contain" />

      <Text className="text-center font-sans-bold text-lg text-white">{t('description1')}</Text>

      <Text className="mt-6 text-center font-sans-bold text-lg text-white">{t('description2')}</Text>

      <TwButton label={t('buttonLabel')} variant="text" className="mt-8" onPress={handlePress} />

      <Image
        source={require('@/assets/images/backup-info-explanation.png')}
        className="mt-8 h-36 w-3/4"
        contentFit="contain"
      />

      <Text className="text-center font-sans-regular text-lg text-white">{t('description3')}</Text>
    </TwModalLayout>
  )
}
