import React, { memo } from 'react'

import { View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'
import { AccountTransactionsTransactionDefaultEvent } from '@/components/AccountTransactionsTransactionDefaultEvent'

import type { TUseTransactionsTransactionDefault } from '@/types/store'

type TProps = {
  transaction: TUseTransactionsTransactionDefault
}

export const AccountTransactionsScreenTransactionDefault = memo(({ transaction }: TProps) => (
  <AccountTransactionsTransactionCard transaction={transaction}>
    <View className="mt-4 gap-y-4">
      {transaction.events.map((event, index) => (
        <AccountTransactionsTransactionDefaultEvent
          key={`${transaction.txId}-event-${index}`}
          event={event}
          account={transaction.account}
        />
      ))}
    </View>
  </AccountTransactionsTransactionCard>
))
