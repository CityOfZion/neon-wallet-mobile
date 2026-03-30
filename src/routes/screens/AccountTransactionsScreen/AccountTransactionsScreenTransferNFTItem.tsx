import React from 'react'

import type { TTransactionNftEvent } from '@cityofzion/blockchain-service'
import { Image } from 'expo-image'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'

import { useNftQuery } from '@/hooks/useNftsQuery'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
  event: TTransactionNftEvent
}

export const AccountTransactionsScreenTransferNFTItem = ({ account, event }: TProps) => {
  const hash = event.nft?.hash
  const { data, isLoading } = useNftQuery(account.blockchain, hash, event.nft?.collection?.hash)

  return (
    <Skeleton.Root loading={isLoading} className="mt-4 items-start gap-2.5">
      <Skeleton.Group className="flex-row">
        <Skeleton.Item className="size-7" />
        <Skeleton.Item className="h-9 w-32" />
      </Skeleton.Group>

      <Skeleton.Content className="flex-row gap-2.5">
        {data?.image && (
          <Image contentFit="contain" className="size-7 rounded bg-gray-800" source={{ uri: data.image }} />
        )}

        <View>
          {data?.name && <Text className="font-sans-regular text-sm capitalize text-white">{data.name}</Text>}

          <View className="flex-row">
            {data?.collection?.name && (
              <Text className="max-w-14 font-sans-regular text-xs text-gray-300" numberOfLines={1}>
                {`${data.collection.name} - `}
              </Text>
            )}

            <Text className="max-w-36 font-sans-regular text-xs text-gray-100" numberOfLines={1}>
              #{hash}
            </Text>
          </View>
        </View>
      </Skeleton.Content>
    </Skeleton.Root>
  )
}
