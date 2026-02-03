import React from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import TbHelp from '@/assets/images/tb-help.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const BuyAndSellTokensInfoModal = ({ navigation }: TRootStackScreenProps<'BuyAndSellTokensInfoModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensInfoModal' })

  const handleAboutData = () => {
    navigation.navigate('BuyAndSellTokensAboutDataModal')
  }

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-white text-xl"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <TbHelp aria-hidden className="mx-auto mt-1 h-24 w-24 stroke-1 text-blue" />

      <Text className="mt-5 font-sans-regular text-white">{t('description')}</Text>

      <TwSeparator containerClassName="my-5" />

      <Text className="font-sans-regular text-white">
        <Trans t={t} i18nKey="aboutData">
          start
          <Text className="font-sans-bold">middle</Text>
          <Text className="italic">end</Text>
        </Trans>
      </Text>

      <View className="mt-1 flex w-fit flex-row items-center">
        <TwButton
          label={t('buttons.aboutData')}
          variant="text-slim"
          className="h-fit w-fit flex-shrink-0 flex-grow-0"
          contentProps={{ className: 'w-fit flex-shrink-0 flex-grow-0' }}
          labelProps={{ className: 'text-sm font-sans-regular w-fit flex-shrink-0 flex-grow-0' }}
          onPress={handleAboutData}
        />
      </View>

      <TwSeparator containerClassName="my-5" />

      <Text className="mb-2 font-sans-semibold text-xs uppercase text-gray-100">{t('buyTokens.title')}</Text>

      <Text className="font-sans-regular text-white">
        <Trans t={t} i18nKey="buyTokens.description">
          start
          <Text className="font-sans-bold">end</Text>
        </Trans>
      </Text>

      <TwBanner
        type="warning"
        iconClassName="stroke-pink w-5 h-5"
        className="mt-5 w-full bg-pink-700"
        iconContainerClassName="py-0 px-3 bg-pink-700"
      >
        <Text className="flex-shrink py-3 pr-3 font-sans-regular text-white">{t('buyTokens.alert')}</Text>
      </TwBanner>

      <TwSeparator containerClassName="my-5" />

      <Text className="mb-2 font-sans-semibold text-xs uppercase text-gray-100">{t('sellTokens.title')}</Text>

      <Text className="font-sans-regular text-white">
        <Trans t={t} i18nKey="sellTokens.description">
          start
          <Text className="font-sans-bold">end</Text>
        </Trans>
      </Text>

      <TwBanner
        type="warning"
        iconClassName="stroke-pink w-5 h-5"
        className="my-5 w-full bg-pink-700"
        iconContainerClassName="py-0 px-3 bg-pink-700"
      >
        <Text className="flex-shrink py-3 pr-3 font-sans-regular text-white">
          <Trans t={t} i18nKey="sellTokens.alert">
            start
            <Text className="uppercase">end</Text>
          </Trans>
        </Text>
      </TwBanner>

      <Text className="mb-6 font-sans-regular text-white">{t('sellTokens.observation')}</Text>

      <TwButton
        label={t('buttons.help')}
        variant="contained-light"
        className="mb-12"
        leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
        onPress={LinkHelper.open.bind(null, ConstantsHelper.cozDiscordUrl)}
      />
    </TwModalLayout>
  )
}
