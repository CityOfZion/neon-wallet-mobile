import { useRef, useState } from 'react'

export const useLoadingActions = (onAct: () => Promise<void> | void) => {
  const [isActing, setIsActing] = useState(false)
  const isActingRef = useRef(false)

  const handleAct = async () => {
    try {
      if (isActingRef.current) return

      isActingRef.current = true
      setIsActing(true)

      await onAct()
    } finally {
      isActingRef.current = false
      setIsActing(false)
    }
  }

  return {
    isActing,
    handleAct,
  }
}
