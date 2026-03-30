import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { AccountTransactionsScreenTransferAssetItem } from './AccountTransactionsScreenTransferAssetItem'
import { AccountTransactionsScreenTransferNFTItem } from './AccountTransactionsScreenTransferNFTItem'

import type { TAccount, TUseTransactionsTransactionEvent } from '@/types/store'

type TProps = {
  account: TAccount
  event: TUseTransactionsTransactionEvent
}

export const AccountTransactionsScreenTransferItem = ({ account, event }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })

  const isReceiver = event.to === account.address
  const label = isReceiver ? t('receivedFromLabel') : t('sentToLabel')
  const address = isReceiver ? event.from : event.to

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-regular text-sm uppercase text-gray-300">{label}</Text>
        <Text className="font-sans-regular text-sm uppercase text-gray-300">{t(`type.${event.eventType}`)}</Text>
      </View>

      <Text
        className={StyleHelper.mergeStyles('w-32 font-sans-regular text-lg', {
          'text-neon': !!address,
          'text-white': !address,
        })}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {address || tCommon('emptyData')}
      </Text>

      {event.eventType === 'token' ? (
        <AccountTransactionsScreenTransferAssetItem account={account} event={event} />
      ) : (
        <AccountTransactionsScreenTransferNFTItem account={account} event={event} />
      )}
    </View>
  )
}
