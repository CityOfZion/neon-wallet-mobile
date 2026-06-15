import React from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import { CreateWalletStep1ScreenItem } from './CreateWalletStep1ScreenItem'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const CreateWalletStep1Screen = ({ navigation }: TMoreStackScreenProps<'CreateWalletStep1Screen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'createWalletStep1' })

  const handlePressContinue = () => {
    navigation.navigate('CreateWalletStep2Screen')
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <View className="gap-7">
          <CreateWalletStep1ScreenItem index={1} title={t('label1')} body={t('body1')} />
          <CreateWalletStep1ScreenItem index={2} title={t('label2')} body={t('body2')} />
          <CreateWalletStep1ScreenItem index={3} title={t('label3')} body={t('body3')} />
        </View>

        <View className="mt-auto py-3">
          <TwButton variant="contained-light" label={t('createWallet')} onPress={handlePressContinue} />
        </View>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
