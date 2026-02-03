import { Image, type ImageProps } from 'expo-image'

import { useImageError } from '@/hooks/useImageError'

import type { TUseImageErrorProps } from '@/types/hooks'

type TProps = ImageProps & TUseImageErrorProps

export const ImageFallback = ({ source, defaultSource, errorSource, ...props }: TProps) => {
  const { handleError, imageSource } = useImageError({ source, defaultSource, errorSource })

  return <Image source={imageSource} onError={handleError} {...props} />
}
