import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BuyAndSellTokensHelper } from '@/helpers/BuyAndSellTokensHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import SumsubLogoIcon from '@/assets/images/sumsub-logo.svg'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'
import UnlimitLogoIcon from '@/assets/images/unlimit-logo.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const BuyAndSellTokensAboutDataModal = ({
  navigation,
}: TRootStackScreenProps<'BuyAndSellTokensAboutDataModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensAboutDataModal' })

  const handleBack = () => {
    navigation.goBack()
  }

  const handleClose = () => {
    navigation.pop(2)
  }

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-white text-xl"
      leftElement={
        <TwIconButton
          aria-label={t('labels.back')}
          icon={<TbArrowLeft className="text-white" aria-hidden />}
          onPress={handleBack}
        />
      }
      rightElement={<TwModalLayoutCloseIconButton onPress={handleClose} />}
    >
      <Text className="mt-2 font-sans-regular text-white">{t('sumsub.description')}</Text>

      <View className="mx-auto my-4 flex max-h-12 w-[80%] items-center justify-center rounded-full bg-gray-300/15 p-2">
        <SumsubLogoIcon aria-hidden className="h-full" />
      </View>

      <TwButton
        label={t('sumsub.link')}
        variant="text-slim"
        className="mx-auto h-fit w-fit flex-shrink-0 flex-grow-0"
        contentProps={{ className: 'w-fit flex-shrink-0 flex-grow-0 gap-x-2' }}
        labelProps={{ className: 'text-sm font-sans-medium w-fit flex-shrink-0 flex-grow-0' }}
        rightElement={<MdOpenInNew aria-hidden className="h-5 w-5 text-neon" />}
        onPress={LinkHelper.open.bind(null, BuyAndSellTokensHelper.sumsubTermsAndConditionsUrl)}
      />

      <TwSeparator containerClassName="my-5" />

      <Text className="font-sans-regular text-white">{t('unlimit.description')}</Text>

      <View className="mx-auto my-4 flex max-h-12 w-[80%] items-center justify-center rounded-full bg-gray-300/15 p-2">
        <UnlimitLogoIcon aria-hidden className="h-full" />
      </View>

      <TwButton
        label={t('unlimit.link')}
        variant="text-slim"
        className="mx-auto h-fit w-fit flex-shrink-0 flex-grow-0"
        contentProps={{ className: 'w-fit flex-shrink-0 flex-grow-0 gap-x-2' }}
        labelProps={{ className: 'text-sm font-sans-medium w-fit flex-shrink-0 flex-grow-0' }}
        rightElement={<MdOpenInNew aria-hidden className="h-5 w-5 text-neon" />}
        onPress={LinkHelper.open.bind(null, BuyAndSellTokensHelper.unlimitUseTermsUrl)}
      />

      <TwSeparator containerClassName="my-5" />

      <Text className="mb-6 font-sans-regular text-white">{t('description')}</Text>

      <TwBanner
        type="warning"
        iconClassName="stroke-pink w-5 h-5"
        className="w-full bg-pink-700"
        iconContainerClassName="py-0 px-3 bg-pink-700"
      >
        <Text className="flex-shrink py-3 pr-3 font-sans-regular text-white">{t('info')}</Text>
      </TwBanner>
    </TwModalLayout>
  )
}
