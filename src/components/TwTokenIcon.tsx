import React from 'react'

import type { ImageProps } from 'expo-image'
import { Image } from 'expo-image'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useImageError } from '@/hooks/useImageError'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type Props = {
  blockchain: TBlockchainServiceKey
  hash: string
  width: number
  height: number
} & Omit<ImageProps, 'source' | 'style'>

const defaultSource = { uri: `${ConstantsHelper.neonIconsUrl}/tokens/default-token.png` }

export const TwTokenIcon = React.memo(
  ({
    blockchain,
    className,
    hash,
    height,
    width,
    contentFit = 'contain',
    cachePolicy = 'memory-disk',
    priority = 'high',
    ...props
  }: Props) => {
    const { handleError, imageSource } = useImageError({
      source: {
        uri: `${ConstantsHelper.neonIconsUrl}/tokens/${blockchain}/${hash}.png`,
      },
      defaultSource,
    })

    return (
      <Image
        {...props}
        className={className}
        source={imageSource}
        placeholder={defaultSource}
        cachePolicy={cachePolicy}
        contentFit={contentFit}
        priority={priority}
        onError={handleError}
        style={{ width, height }}
      />
    )
  }
)
