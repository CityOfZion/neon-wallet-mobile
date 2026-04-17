import { View } from 'react-native'

import { ToasterToastContainer } from './ToasterToastContainer'

import type { TToasterToastOptions } from '@/types/toaster'

type TProps = {
  toasts: TToasterToastOptions[]
  onDismiss: (id: string) => void
}

export const ToasterContainer = ({ toasts, onDismiss }: TProps) => {
  return (
    <View className="absolute top-[calc(env(safe-area-inset-top)+8px)] w-full gap-1.5">
      {toasts.map(toast => (
        <ToasterToastContainer key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  )
}
