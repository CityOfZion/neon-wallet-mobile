import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbHelp from '@/assets/images/tb-help.svg'

export const AboutExtraIdToReceiveModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'aboutExtraIdToReceive' })

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} contentContainerClassName="gap-6">
      <TbHelp aria-hidden className="mx-auto h-32 w-32 stroke-1 text-blue" />

      <View className="gap-2">
        <Text className="font-sans-semibold text-base uppercase text-gray-100">{t('what.title')}</Text>

        <Text className="font-sans-regular text-base text-white">{t('what.description')}</Text>
      </View>

      <TwSeparator />

      <View className="gap-2">
        <Text className="font-sans-semibold text-base uppercase text-gray-100">{t('why.title')}</Text>

        <Text className="font-sans-regular text-base text-white">{t('why.description')}</Text>
      </View>

      <TwSeparator />

      <View className="gap-2">
        <Text className="font-sans-semibold text-base uppercase text-gray-100">{t('where.title')}</Text>

        <Text className="font-sans-regular text-base text-white">{t('where.description')}</Text>
      </View>
    </TwModalLayout>
  )
}
