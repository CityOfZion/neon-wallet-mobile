import { useCallback, useEffect, useMemo, useState } from 'react'

import type { TUseImageErrorProps } from '@/types/hooks'

export const useImageError = ({ source, defaultSource, errorSource }: TUseImageErrorProps) => {
  const [isDefaultImageSource, setIsDefaultImageSource] = useState(false)
  const [isErrorImageSource, setIsErrorImageSource] = useState(false)

  const imageSource = useMemo(() => {
    if ((isErrorImageSource || (!source && !defaultSource)) && errorSource) return errorSource
    if ((isDefaultImageSource || !source) && defaultSource) return defaultSource

    return source
  }, [defaultSource, errorSource, isErrorImageSource, isDefaultImageSource, source])

  const handleError = useCallback(() => {
    if (isErrorImageSource) return

    if (isDefaultImageSource) {
      setIsErrorImageSource(true)

      return
    }

    setIsDefaultImageSource(true)
  }, [isDefaultImageSource, isErrorImageSource])

  useEffect(() => {
    setIsDefaultImageSource(false)
    setIsErrorImageSource(false)
  }, [source?.uri, defaultSource?.uri])

  return { imageSource, handleError }
}
