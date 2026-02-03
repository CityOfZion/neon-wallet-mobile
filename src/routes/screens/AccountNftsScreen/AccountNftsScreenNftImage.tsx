import React from 'react'

import { Image } from 'expo-image'
import { View } from 'react-native'

import { useImageError } from '@/hooks/useImageError'

type TProps = {
  image?: string
}

const DEFAULT_SOURCE = require('@/assets/images/diamond-green.png')

export const AccountNftsScreenNftImage = ({ image }: TProps) => {
  const { imageSource, handleError } = useImageError({
    source: image ? { uri: image } : DEFAULT_SOURCE,
    defaultSource: DEFAULT_SOURCE,
  })

  return (
    <View className="size-12 items-center justify-center overflow-hidden rounded bg-gray-900 p-1">
      <Image contentFit="cover" source={imageSource} onError={handleError} className="size-full" />
    </View>
  )
}
