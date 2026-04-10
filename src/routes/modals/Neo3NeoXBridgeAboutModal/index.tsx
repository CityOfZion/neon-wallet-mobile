import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwBanner } from '@/components/TwBanner'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbHelp from '@/assets/images/tb-help.svg'

export const Neo3NeoXBridgeAboutModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeAboutModal' })

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-xl text-white"
      contentContainerClassName="gap-y-4"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <TbHelp aria-hidden className="mx-auto mb-2 h-24 w-24 stroke-1 text-blue" />

      <Text className="font-sans-semibold text-lg text-white">{t('description')}</Text>

      <Text className="font-sans-regular text-lg text-white">{t('explanation')}</Text>

      <Text className="flex-grow font-sans-regular text-lg text-white">{t('neonAdvantage')}</Text>

      <TwBanner type="alert" textClassName="text-lg" iconClassName="text-orange" className="mt-8">
        {t('warningLabel')}
      </TwBanner>
    </TwModalLayout>
  )
}
