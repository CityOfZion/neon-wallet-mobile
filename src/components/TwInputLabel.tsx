import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  label: string
  description?: string
} & ViewProps

export const TwInputLabel = ({ label, description, className, ...props }: TProps) => {
  return (
    <View className={StyleHelper.mergeStyles('mb-3 flex-row gap-2', className)} {...props}>
      <Text className="font-sans-semibold text-sm uppercase text-gray-100">{label}</Text>
      {description && (
        <Text className="flex-shrink font-sans-regular text-sm text-gray-300" numberOfLines={1} ellipsizeMode="middle">
          {description}
        </Text>
      )}
    </View>
  )
}
