import React from 'react'

import type { TTransactionDefaultEvent } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountHelper } from '@/helpers/AccountHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountsMapSelector } from '@/hooks/useAccountSelector'

import { AccountTransactionsTransactionDefaultEventGeneric } from './AccountTransactionsTransactionDefaultEventGeneric'
import { AccountTransactionsTransactionDefaultEventToken } from './AccountTransactionsTransactionDefaultEventToken'
import { AccountTransactionsTransactionItemNft } from './AccountTransactionsTransactionItemNft'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  event: TTransactionDefaultEvent
  relatedAddress?: string
  blockchain: TBlockchainServiceKey
}

export const AccountTransactionsTransactionDefaultEvent = ({ event, relatedAddress, blockchain }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'accountTransactionsTransactionDefaultEvent' })
  const { t: tCommon } = useTranslation('common')
  const { accountsMap } = useAccountsMapSelector()

  const isSender = event.from === relatedAddress
  const label = isSender ? t('toLabel') : t('fromLabel')
  const address = isSender ? event.to : event.from
  const account = address ? accountsMap.get(AccountHelper.buildAccountKey({ address, blockchain })) : undefined

  const eventTypeLabel = t(`type.${event.eventType}`, event.methodName || '')

  return (
    <View>
      <View className="flex-row justify-between">
        <View>
          <Text className="font-sans-regular text-base uppercase text-gray-300">{label}</Text>

          <Text
            className={StyleHelper.mergeStyles('w-40 font-sans-medium text-base', {
              'text-neon': !!address,
              'text-white': !address,
            })}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {account?.name || address || tCommon('general.emptyData')}
          </Text>
        </View>

        <Text className="grow text-right font-sans-regular text-base uppercase text-gray-300">{eventTypeLabel}</Text>
      </View>

      {event.eventType === 'token' && (
        <AccountTransactionsTransactionDefaultEventToken blockchain={blockchain} event={event} />
      )}

      {event.eventType === 'nft' && !!event.nft && (
        <AccountTransactionsTransactionItemNft blockchain={blockchain} nft={event.nft} />
      )}

      {event.eventType === 'generic' && <AccountTransactionsTransactionDefaultEventGeneric event={event} />}
    </View>
  )
}
