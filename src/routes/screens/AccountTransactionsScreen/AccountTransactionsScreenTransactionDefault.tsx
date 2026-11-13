import React, { memo } from 'react'

import type { TTransactionDefault } from '@cityofzion/blockchain-service'
import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'
import { AccountTransactionsTransactionDefaultEvent } from '@/components/AccountTransactionsTransactionDefaultEvent'

type TProps = {
  transaction: TTransactionDefault<TBSServiceName>
}

export const AccountTransactionsScreenTransactionDefault = memo(({ transaction }: TProps) => (
  <AccountTransactionsTransactionCard transaction={transaction}>
    {transaction.events.length > 0 && (
      <View className="mt-4 gap-y-4">
        {transaction.events.map((event, index) => (
          <AccountTransactionsTransactionDefaultEvent
            key={`${transaction.txId}-event-${index}`}
            event={event}
            blockchain={transaction.blockchain}
            relatedAddress={transaction.relatedAddress}
          />
        ))}
      </View>
    )}
  </AccountTransactionsTransactionCard>
))
