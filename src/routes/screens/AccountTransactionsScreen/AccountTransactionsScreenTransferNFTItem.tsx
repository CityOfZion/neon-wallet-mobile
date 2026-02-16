import React from 'react'

import type { TTransactionNftEvent } from '@cityofzion/blockchain-service'
import { Image } from 'expo-image'
import { Text, View } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'

import { useNftQuery } from '@/hooks/useNftsQuery'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
  event: TTransactionNftEvent
}

export const AccountTransactionsScreenTransferNFTItem = ({ account, event }: TProps) => {
  const { data, isLoading } = useNftQuery(account.blockchain, event.tokenHash, event.collectionHash)

  return (
    <View className="mt-4 flex-row items-center gap-2.5">
      <TwSkeleton
        isLoading={isLoading}
        layout={[
          { width: 28, height: 28 },
          { width: 128, height: 36 },
        ]}
        className="flex-row"
      >
        {data?.image && (
          <Image contentFit="contain" className="h-7 w-7 rounded bg-gray-800" source={{ uri: data.image }} />
        )}

        <View>
          {data?.name && <Text className="font-sans-regular text-sm text-white">{data.name}</Text>}
          <View className="flex-row">
            {data?.collection?.name && (
              <Text className="max-w-14 text-xs text-gray-300" numberOfLines={1}>
                {`${data.collection.name} - `}
              </Text>
            )}

            <Text className="max-w-36 font-sans-regular text-xs text-gray-100" numberOfLines={1}>
              #{event.tokenHash}
            </Text>
          </View>
        </View>
      </TwSkeleton>
    </View>
  )
}
