import { TransactionTransferNft, hasNft } from '@cityofzion/blockchain-service'
import React, { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { Skeleton } from '~/src/components/Skeleton'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = TransactionTransferNft & {
  account: Account
}

export const TransferNFTItem = React.memo(({ account, ...props }: Props) => {
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )

  const getNFTInfo = useCallback(async () => {
    try {
      if (!hasNft(blockchainService)) return

      return await blockchainService.nftDataService.getNft({
        contractHash: props.contractHash,
        tokenId: props.tokenId,
      })
    } catch {}
  }, [props.contractHash, props.tokenId, blockchainService])

  const { data, isLoading } = useQuery(['nft', props.contractHash, props.tokenId], getNFTInfo)

  return (
    <LinearLayout orientation="horiz" alignItems="flex-end" flexGrow={1} flexShrink={1}>
      <Skeleton isLoading={isLoading} layout={{ width: 30, height: 30 }} withDefaultStyle={false}>
        {data?.image && (
          <LinearLayout borderRadius="2px" overflow="hidden">
            <ImageView
              resizeMode="contain"
              alignSelf="center"
              source={{ uri: data.image }}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </LinearLayout>
        )}
      </Skeleton>
      <Skeleton isLoading={isLoading} layout={{ width: '100%', height: 30, marginLeft: 8 }}>
        <LinearLayout ml="8px" flexGrow={1} flexShrink={1}>
          {data?.name && (
            <TextView color="text.0" fontFamily="bold" fontSize="16px">
              {data.name}
            </TextView>
          )}

          <LinearLayout orientation="horiz" flexGrow={1} flexShrink={1}>
            {data?.collectionName && (
              <TextView fontSize="10px" color="text.10" maxWidth="60%" ellipsizeMode="tail" numberOfLines={1}>
                {data.collectionName}
              </TextView>
            )}

            <TextView
              fontSize="10px"
              color="text.10"
              flexGrow={1}
              flexShrink={1}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {data?.collectionName ? `- #${props.tokenId}` : props.tokenId}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </Skeleton>
    </LinearLayout>
  )
})
