import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwBanner } from '@/components/TwBanner'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbHelp from '@/assets/images/tb-help.svg'

export const Neo3NeoXBridgeAboutModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeAbout' })

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="gap-y-4">
        <TbHelp aria-hidden className="mx-auto mb-2 size-24 stroke-1 text-blue" />

        <Text className="font-sans-semibold text-lg text-white">{t('description')}</Text>

        <Text className="font-sans-regular text-lg text-white">{t('explanation')}</Text>

        <Text className="flex-grow font-sans-regular text-lg text-white">{t('neonAdvantage')}</Text>

        <TwBanner type="alert" textClassName="text-lg" iconClassName="text-orange" className="mt-8">
          {t('warningLabel')}
        </TwBanner>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
