import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

export const VoteNeo3HowItWorksModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'voteNeo3HowItWorksModal' })

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="gap-y-6 pt-2"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <Text className="font-sans-bold text-lg text-white">{t('explanationLabel')}</Text>

      <View className="flex flex-col">
        <Text className="font-sans-bold text-lg text-white">{t('whyVoteTitle')}</Text>

        <Text className="font-sans-regular text-lg text-white">{t('whyVoteDescription')}</Text>
      </View>

      <View className="flex flex-grow flex-col">
        <Text className="font-sans-bold text-lg text-gray-100">{t('noteTitle')}</Text>

        <Text className="font-sans-regular text-lg text-gray-100">{t('noteDescription')}</Text>
      </View>

      <TwBanner type="alert" textClassName="text-lg">
        {t('alertLabel')}
      </TwBanner>
    </TwModalLayout>
  )
}
