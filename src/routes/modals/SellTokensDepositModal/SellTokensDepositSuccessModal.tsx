import React from 'react'

import type { TTransactionTransferAsset } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SellTokensDepositSuccessModal = ({ route }: TRootStackScreenProps<'SellTokensDepositSuccessModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccessModal' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  const { pendingTransaction } = route.params
  const { token, ...transfer } = pendingTransaction.transfers[0] as TTransactionTransferAsset
  const { blockchain } = pendingTransaction.account

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="pt-4"
      titleClassName="text-white"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <PiSealCheck aria-hidden className="mx-auto h-24 w-24 text-blue" />

      <Text className="mx-12 mt-4 text-center font-sans-medium text-xl text-white">{t('subtitle')}</Text>

      <View className="mt-6 w-full gap-2 rounded bg-asphalt p-3 py-3">
        <View className="mb-1 flex-row items-center gap-x-2">
          <TbReceipt aria-hidden className="h-5 w-5 text-blue" />
          <Text className="font-sans-regular text-sm text-white">{t('details.label')}</Text>
        </View>

        <TwSeparator />

        <Text className="mt-4 bg-gray-700/60 px-2 py-1.5 font-sans-medium text-blue">{t('transaction.label')}</Text>

        <View className="flex flex-col gap-y-2 px-2 py-1">
          <Text className="font-sans-medium text-xs uppercase text-gray-100">{t('recipient.label')}</Text>

          <View className="flex flex-row items-center justify-between gap-x-3">
            <Text
              className="max-w-[60%] flex-shrink flex-grow font-sans-regular text-sm text-white"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {transfer.to}
            </Text>

            <TwIconButton
              aria-label={t('recipient.copy')}
              size="sm"
              className="mt-1 h-4 w-4"
              icon={<TbCopy aria-hidden className="text-neon" />}
              onPress={() => ClipboardHelper.write(transfer.to)}
            />
          </View>
        </View>

        <TwSeparator />

        <View className="flex flex-col gap-y-2 px-2 py-1">
          <Text className="font-sans-medium text-xs uppercase text-gray-100">{t('amount.label')}</Text>

          <View className="flex w-full flex-row items-center gap-x-2">
            <TwBlockchainIcon blockchain={blockchain} type="gray" className="h-3 w-3" />

            <Text
              className="flex-shrink flex-grow font-sans-regular text-sm text-white"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {token!.symbol}{' '}
              <Text className="font-sans-regular text-sm uppercase text-gray-100">
                | {tCommonBlockchainServices(`${blockchain}.label`)}
              </Text>
            </Text>

            <Text className="max-w-[50%] font-sans-regular text-sm text-white" numberOfLines={1}>
              {transfer.amount}
            </Text>
          </View>
        </View>

        <TwSeparator />

        <View className="flex flex-col gap-y-2 px-2 py-1">
          <Text className="font-sans-medium text-xs uppercase text-gray-100">{t('transactionHash.label')}</Text>

          <View className="flex w-full flex-row items-center gap-x-3">
            <Text className="flex-shrink flex-grow break-all font-sans-regular text-sm text-white">
              {pendingTransaction.hash}
            </Text>

            <TwIconButton
              aria-label={t('transactionHash.copy')}
              size="sm"
              className="mt-1 h-4 w-4"
              icon={<TbCopy aria-hidden className="text-neon" />}
              onPress={() => ClipboardHelper.write(pendingTransaction.hash)}
            />
          </View>
        </View>
      </View>
    </TwModalLayout>
  )
}
