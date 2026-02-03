import type { ReactNode } from 'react'
import { View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  className?: string
  children: ReactNode
}

export const ActionCard = ({ className, children }: TProps) => (
  <View className={StyleHelper.mergeStyles('rounded bg-gray-300/15 px-1 py-3', className)}>{children}</View>
)
