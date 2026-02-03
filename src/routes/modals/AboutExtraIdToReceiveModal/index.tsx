import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbHelp from '@/assets/images/tb-help.svg'

export const AboutExtraIdToReceiveModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'aboutExtraIdToReceiveModal' })

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} contentContainerClassName="gap-6">
      <TbHelp aria-hidden className="mx-auto h-32 w-32 stroke-1 text-blue" />

      <View className="gap-2">
        <Text className="text-md font-sans-semibold uppercase text-gray-100">{t('what.title')}</Text>

        <Text className="text-md font-sans-regular text-white">{t('what.description')}</Text>
      </View>

      <TwSeparator />

      <View className="gap-2">
        <Text className="text-md font-sans-semibold uppercase text-gray-100">{t('why.title')}</Text>

        <Text className="text-md font-sans-regular text-white">{t('why.description')}</Text>
      </View>

      <TwSeparator />

      <View className="gap-2">
        <Text className="text-md font-sans-semibold uppercase text-gray-100">{t('where.title')}</Text>

        <Text className="text-md font-sans-regular text-white">{t('where.description')}</Text>
      </View>
    </TwModalLayout>
  )
}
