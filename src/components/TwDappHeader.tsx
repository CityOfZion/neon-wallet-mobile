import React, { type ReactNode, useState } from 'react'

import { Image } from 'expo-image'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useImageError } from '@/hooks/useImageError'

import { Loader } from './Loader'

type TProps = {
  uri: string
  title?: ReactNode
} & ViewProps

export const TwDappHeader = ({ uri, title, className, ...props }: TProps) => {
  const { handleError, imageSource } = useImageError({
    source: { uri },
    defaultSource: { uri: `${ConstantsHelper.neonIconsUrl}/dapps/default-dapp.png` },
  })

  const [isLoading, setIsLoading] = useState(true)

  return (
    <View className={StyleHelper.mergeStyles('items-center gap-3.5', className)} {...props}>
      <View className="relative size-20 items-center justify-center overflow-hidden rounded-full bg-asphalt/50 p-2">
        <Image
          className={StyleHelper.mergeStyles('size-full rounded-full', { 'opacity-0': isLoading })}
          source={imageSource}
          onLoadEnd={() => setIsLoading(false)}
          onError={handleError}
          contentFit="contain"
        />

        {isLoading && <Loader className="size-10" containerClassName="absolute" />}
      </View>

      {title && <Text className="text-center font-sans-regular text-lg text-white">{title}</Text>}
    </View>
  )
}
