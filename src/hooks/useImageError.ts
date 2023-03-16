import { useCallback, useRef, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

type Props = {
  source: ImageSourcePropType
  defaultSource?: ImageSourcePropType
}

export const useImageError = ({ source, defaultSource }: Props) => {
  const shouldSwitch = useRef(true)
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(source)

  const handleError = useCallback(() => {
    if (!shouldSwitch.current) return

    setImageSource(defaultSource ?? require('~src/assets/logos/icon-dapp-default.png'))
  }, [])

  return {
    imageSource,
    handleError,
  }
}
