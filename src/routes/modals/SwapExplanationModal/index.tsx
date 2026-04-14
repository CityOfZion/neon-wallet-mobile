import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import TbReplace from '@/assets/images/tb-replace.svg'

export const SwapExplanationModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapExplanation' })

  const handleOpenDiscord = async () => {
    await LinkHelper.open(ConstantsHelper.cozDiscordUrl)
  }

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton />}
      contentContainerClassName="items-center"
    >
      <TbReplace className="mt-10 h-32 w-32 stroke-1 text-blue" />

      <View className="mt-14 flex-grow gap-8 px-4">
        <Text className="font-sans-bold text-lg text-white">{t('description1')}</Text>

        <Text className="font-sans-regular text-lg text-white">{t('description2')}</Text>
      </View>

      <TwButton
        label={t('help')}
        variant="contained-light"
        className="mt-8"
        leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
        onPress={handleOpenDiscord}
      />
    </TwModalLayout>
  )
}
