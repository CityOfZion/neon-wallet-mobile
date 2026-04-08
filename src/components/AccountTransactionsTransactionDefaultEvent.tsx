import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { StyleHelper } from '@/helpers/StyleHelper'

import { AccountTransactionsTransactionDefaultEventToken } from './AccountTransactionsTransactionDefaultEventToken'
import { AccountTransactionsTransactionItemNft } from './AccountTransactionsTransactionItemNft'

import type { TAccount, TUseTransactionsTransactionEvent } from '@/types/store'

type TProps = {
  event: TUseTransactionsTransactionEvent
  account: TAccount
}

export const AccountTransactionsTransactionDefaultEvent = ({ event, account }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'accountTransactionsTransactionDefaultEvent' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })

  const isSender = event.from === account.address
  const label = isSender ? t('toLabel') : t('fromLabel')
  const address = isSender ? event.to : event.from

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-regular text-base uppercase text-gray-300">{label}</Text>
        <Text className="font-sans-regular text-base uppercase text-gray-300">{t(`type.${event.eventType}`)}</Text>
      </View>

      <Text
        className={StyleHelper.mergeStyles('w-40 font-sans-medium text-base', {
          'text-neon': !!address,
          'text-white': !address,
        })}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {address || tCommon('emptyData')}
      </Text>

      {match(event)
        .with(
          P.when(value => value.eventType === 'token'),
          currentEvent => (
            <AccountTransactionsTransactionDefaultEventToken blockchain={account.blockchain} event={currentEvent} />
          )
        )
        .with(
          P.when(value => value.eventType === 'nft' && !!value.nft),
          currentEvent => (
            <AccountTransactionsTransactionItemNft blockchain={account.blockchain} nft={currentEvent.nft!} />
          )
        )
        .otherwise(() => null)}
    </View>
  )
}
