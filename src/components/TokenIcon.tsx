import React from 'react'
import { ImageResizeMode } from 'react-native'

import { BlockchainServiceKey } from '../blockchain'
import { useTokenIcon } from '../hooks/useTokens'
import { ImageView } from '../styles/styled-components'
import { Skeleton } from './Skeleton'

type Props = {
  hash: string
  blockchain: BlockchainServiceKey
  symbol: string
  resizeMode?: ImageResizeMode
  width: number
  height: number
  marginRight?: number
  marginLeft?: number
  marginTop?: number
  marginBottom?: number
}

export const TokenIcon = ({
  hash,
  height,
  width,
  blockchain,
  symbol,
  resizeMode,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
}: Props) => {
  const { data, isLoading } = useTokenIcon({
    blockchain,
    symbol,
    hash,
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
