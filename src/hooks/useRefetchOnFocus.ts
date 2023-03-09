import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'

export const useRefetchOnFocus = (refetch: () => void) => {
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      refetch()
    }
  }, [isFocused])
}
