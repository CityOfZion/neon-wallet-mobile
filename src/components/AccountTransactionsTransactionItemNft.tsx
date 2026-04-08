import React from 'react'

import type { TNftResponse } from '@cityofzion/blockchain-service'
import { Image } from 'expo-image'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'

import { useNftQuery } from '@/hooks/useNftsQuery'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
  nft: TNftResponse
}

export const AccountTransactionsTransactionItemNft = ({ blockchain, nft }: TProps) => {
  const { data, isLoading } = useNftQuery(blockchain, nft.hash, nft.collection?.hash)

  return (
    <Skeleton.Root loading={isLoading} className="mt-2 items-start gap-2">
      <Skeleton.Group className="flex-row">
        <Skeleton.Item className="size-9 rounded bg-gray-800" />
        <Skeleton.Item className="h-9 w-44 rounded bg-gray-800" />
      </Skeleton.Group>

      <Skeleton.Content className="flex-row gap-2.5">
        {data?.image && (
          <Image contentFit="contain" className="size-9 rounded bg-gray-800" source={{ uri: data.image }} />
        )}

        <View>
          {data?.name && <Text className="font-sans-medium text-base capitalize text-white">{data.name}</Text>}

          <View className="flex-row">
            {data?.collection?.name && (
              <Text className="max-w-14 font-sans-regular text-xs text-gray-300" numberOfLines={1}>
                {`${data.collection.name} - `}
              </Text>
            )}

            <Text className="max-w-36 font-sans-regular text-xs text-gray-100" numberOfLines={1}>
              #{nft.hash}
            </Text>
          </View>
        </View>
      </Skeleton.Content>
    </Skeleton.Root>
  )
}
