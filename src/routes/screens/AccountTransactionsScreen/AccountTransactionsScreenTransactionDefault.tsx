import React, { memo } from 'react'

import type { TTransactionDefault } from '@cityofzion/blockchain-service'
import { View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'
import { AccountTransactionsTransactionDefaultEvent } from '@/components/AccountTransactionsTransactionDefaultEvent'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  transaction: TTransactionDefault<TBlockchainServiceKey>
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
