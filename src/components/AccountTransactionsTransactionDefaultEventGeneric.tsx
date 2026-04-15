import React from 'react'

import { type TTransactionDefaultGenericEvent } from '@cityofzion/blockchain-service'
import { Text, View } from 'react-native'

type TProps = {
  event: TTransactionDefaultGenericEvent
}

export const AccountTransactionsTransactionDefaultEventGeneric = ({ event }: TProps) => {
  if (!event.data) return null

  return (
    <View className="mt-4 flex-row flex-wrap items-center gap-2">
      {Object.entries(event.data).map(([key, value]) => (
        <Text className="font-sans-regular text-base text-gray-300" numberOfLines={1} ellipsizeMode="middle" key={key}>
          {value}
        </Text>
      ))}
    </View>
  )
}
