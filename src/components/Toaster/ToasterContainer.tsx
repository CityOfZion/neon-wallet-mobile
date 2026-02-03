import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ToasterToastContainer } from './ToasterToastContainer'

import type { TToasterToastOptions } from '@/types/toaster'

type TProps = {
  toasts: TToasterToastOptions[]
  onDismiss: (id: string) => void
}

export const ToasterContainer = ({ toasts, onDismiss }: TProps) => {
  const { top } = useSafeAreaInsets()

  return (
    <View className="absolute w-full gap-1.5" style={{ top: top + 8 }}>
      {toasts.map(toast => (
        <ToasterToastContainer key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  )
}
