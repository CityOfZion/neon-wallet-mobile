import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'
import React, { useCallback } from 'react'
import { ImageResizeMode, ImageSourcePropType } from 'react-native'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { defaultTokenIcon, tokenIconsByBlockchain } from '../assets/blockchain/tokens-images'
import { RootState } from '../store/RootStore'
import { ImageView } from '../styles/styled-components'
import { TBlockchainServiceKey } from '../types/blockchain'
import { Skeleton } from './Skeleton'

type Props = {
  hash: string
  blockchain: TBlockchainServiceKey
  symbol: string
  resizeMode?: ImageResizeMode
  width: number
  height: number
  marginRight?: number
  marginLeft?: number
  marginTop?: number
  marginBottom?: number
}

export const TokenIcon = React.memo(
  ({
    hash,
    height,
    width,
    blockchain,
    symbol,
    resizeMode = 'contain',
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
  }: Props) => {
    const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

    const fetchIcon = useCallback(async (): Promise<ImageSourcePropType> => {
      try {
        const service = bsAggregator.getBlockchainByName(blockchain)

        if (blockchain === 'neo3' && service.network.type === 'mainnet') {
          const invoker = await NeonInvoker.init({ rpcAddress: service.network.url })
          const iconDappResponse = await invoker.testInvoke({
            invocations: [
              {
                scriptHash: '489e98351485bbd85be99618285932172f1862e4',
                operation: 'getMetaData',
                args: [{ type: 'Hash160', value: hash }],
              },
            ],
          })

          const formattedResult = NeonParser.parseRpcResponse(iconDappResponse.stack[0])
          return { uri: formattedResult['icon/288x288'] }
        }
      } catch {}

      return tokenIconsByBlockchain[blockchain][symbol] ?? defaultTokenIcon
    }, [bsAggregator, blockchain, hash, symbol])

    const { isLoading, data } = useQuery(['token_icon', hash], fetchIcon, {
      staleTime: 0,
      cacheTime: 0,
      refetchInterval: false,
    })

    return (
      <Skeleton
        isLoading={isLoading}
        layout={[{ width, height, borderRadius: Math.max(width, height) }]}
        withDefaultStyle={false}
        containerStyle={{ marginBottom, marginLeft, marginRight, marginTop }}
      >
        {data && (
          <ImageView
            source={data}
            width={width}
            height={height}
            resizeMode={resizeMode}
            style={{ marginBottom, marginLeft, marginRight, marginTop }}
          />
        )}
      </Skeleton>
    )
  }
)
