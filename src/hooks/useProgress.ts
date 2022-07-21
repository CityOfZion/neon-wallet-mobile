import { useState } from 'react'

export function useProgress() {
  const [progressState, setProgressState] = useState<number>(0)

  const increment = (progress: number) => {
    setProgressState(prevState => {
      if (progress + prevState >= 1) {
        return 1
      } else {
        return progress + prevState
      }
    })
  }

  return {
    currentProgress: progressState,
    increment,
  }
}
