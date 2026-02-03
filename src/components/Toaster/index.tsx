import { useCallback, useState } from 'react'

import { Platform } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import { ToasterContainer } from './ToasterContainer'

import type { TToasterToastOptions } from '@/types/toaster'

type TToasterContext = {
  add(toast: TToasterToastOptions): void
  dismiss(id: string): void
}

export let toasterContext: TToasterContext | undefined

const Toaster = () => {
  const [toasts, setToasts] = useState<TToasterToastOptions[]>([])

  const add = useCallback((options: TToasterToastOptions) => {
    setToasts(prev => {
      const existingToastIndex = prev.findIndex(toast => toast.id === options.id)

      if (existingToastIndex !== -1) {
        const updatedToasts = [...prev]
        updatedToasts[existingToastIndex] = { ...updatedToasts[existingToastIndex], ...options }
        return updatedToasts
      }

      return [...prev, options]
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  toasterContext = { add, dismiss }

  if (Platform.OS === 'ios') {
    return (
      <FullWindowOverlay>
        <ToasterContainer toasts={toasts} onDismiss={dismiss} />
      </FullWindowOverlay>
    )
  }

  return <ToasterContainer toasts={toasts} onDismiss={dismiss} />
}

export default Toaster
