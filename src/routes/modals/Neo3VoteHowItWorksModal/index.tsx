import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'

import { ModalLayout } from '@/layouts/ModalLayout'

export const Neo3VoteHowItWorksModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteHowItWorks' })

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="gap-y-6 pt-2">
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
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
