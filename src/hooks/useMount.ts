import { useEffect, useRef, useState } from 'react'

import type { DependencyList } from 'react'

type TEffect = () => void | Promise<void> | (() => void) | Promise<() => void>

export const useMount = (effect: TEffect, changingStateVars?: DependencyList, delay: number = 500) => {
  const [isMounting, setIsMounting] = useState(true)

  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    setIsMounting(true)
    let destroyCallback: ReturnType<TEffect> | undefined

    timeoutRef.current = setTimeout(async () => {
      try {
        destroyCallback = await effect()
      } finally {
        setIsMounting(false)
      }
    }, delay)

    return () => {
      clearTimeout(timeoutRef.current)

      if (destroyCallback && typeof destroyCallback === 'function') {
        destroyCallback()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, changingStateVars || [])

  return { isMounting }
}
