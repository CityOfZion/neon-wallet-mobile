import React from 'react'

import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type Props = {
  label: string
  footer?: React.ReactNode
} & ViewProps

export const FlatListEmpty = ({ label, footer, className, children, ...props }: Props) => {
  return (
    <View className={StyleHelper.mergeStyles('flex-grow items-center justify-center gap-4', className)} {...props}>
      <Text className="font-sans-medium text-2xl text-gray-300">{label}</Text>
      {footer}
      {children}
    </View>
  )
}
