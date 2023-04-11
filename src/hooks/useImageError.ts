import { useCallback, useMemo, useRef, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

type Props = {
  source: ImageSourcePropType
  defaultSource?: ImageSourcePropType
}

export const useImageError = ({ source, defaultSource }: Props) => {
  const [isDefault, setIsDefault] = useState<boolean>(false)

  const imageSource = useMemo(() => {
    if (!isDefault) return source
    return defaultSource ?? require('~src/assets/logos/icon-dapp-default.png')
  }, [isDefault])

  const handleError = useCallback(() => {
    setIsDefault(true)
  }, [])

  return {
    imageSource,
    handleError,
    isDefault,
  }
}
