import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import MdLaunch from '@/assets/images/md-launch.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
  formattedDateTo: string
  formattedDateFrom: string
}

export const ExportFullTransactionsSuccessModalContent = ({ account, formattedDateFrom, formattedDateTo }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'exportFullTransactionsModal.successModal' })
  const { t: commonT } = useTranslation('common')

  const handlePressDiscord = () => {
    LinkHelper.open(ConstantsHelper.cozDiscordUrl)
  }

  return (
    <Fragment>
      <Text className="font-sans-medium text-xl text-white">{t('description')}</Text>

      <View className="mt-5 w-full rounded bg-asphalt px-4 py-5">
        <View className="flex-row gap-2.5 pb-3.5">
          <TbReceipt aria-hidden className="text-blue" />
          <Text className="flex-1 font-sans-regular text-lg text-white">{t('detailsTitle')}</Text>

          <Text className="font-sans-regular text-lg text-gray-100">{t('detailsSubtitle')}</Text>
        </View>

        <TwSeparator />

        <View className="py-6">
          <Text className="mb-2.5 font-sans-regular text-sm uppercase text-gray-100">
            {t('detailsExportedAccountLabel')}
          </Text>

          <Text className="font-sans-regular text-lg text-white" numberOfLines={1}>
            {account.name}
          </Text>
          <Text className="w-28 font-sans-regular text-lg text-blue" numberOfLines={1} ellipsizeMode="middle">
            {account.address}
          </Text>
          <Text className="font-sans-regular text-lg text-gray-100">
            {commonT(`blockchainServices.${account.blockchain}.label`)}
          </Text>
        </View>

        <TwSeparator />

        <View className="py-6">
          <Text className="mb-2.5 font-sans-regular text-sm uppercase text-gray-100">
            {t('detailsTransactionTypesLabel')}
          </Text>

          <Text className="font-sans-regular text-lg text-white" numberOfLines={1}>
            {t('detailsTransactionTypesValue')}
          </Text>
        </View>

        <TwSeparator />

        <View className="pt-6">
          <Text className="mb-2.5 font-sans-regular text-sm uppercase text-gray-100">
            {t('detailsTimePeriodLabel')}
          </Text>

          <Text className="font-sans-regular text-lg text-blue" numberOfLines={1}>
            {t('detailsTimePeriodStartLabel')}: <Text className="text-white">{formattedDateFrom}</Text>
          </Text>

          <Text className="font-sans-regular text-lg text-blue" numberOfLines={1}>
            {t('detailsTimePeriodEndLabel')}: <Text className="text-white">{formattedDateTo}</Text>
          </Text>
        </View>
      </View>

      <View className="mt-auto w-full pt-8">
        <TwButton
          variant="contained-light"
          leftElement={<MdLaunch aria-hidden />}
          label={t('needHelpButtonLabel')}
          onPress={handlePressDiscord}
        />
      </View>
    </Fragment>
  )
}
