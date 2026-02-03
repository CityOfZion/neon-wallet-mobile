import React from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import { CreateWalletStep1ScreenItem } from './CreateWalletStep1ScreenItem'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep1Screen = ({ navigation }: TMoreStackScreenProps<'CreateWalletStep1Screen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep1Screen' })

  const handlePressContinue = () => {
    navigation.navigate('CreateWalletStep2Screen')
  }

  return (
    <TwScreenLayout title={t('title')}>
      <View className="gap-7">
        <CreateWalletStep1ScreenItem index={1} title={t('label_1')} body={t('body_1')} />
        <CreateWalletStep1ScreenItem index={2} title={t('label_2')} body={t('body_2')} />
        <CreateWalletStep1ScreenItem index={3} title={t('label_3')} body={t('body_3')} />
      </View>

      <View className="mt-auto py-3">
        <TwButton variant="contained-light" label={t('createWallet')} onPress={handlePressContinue} />
      </View>
    </TwScreenLayout>
  )
}
