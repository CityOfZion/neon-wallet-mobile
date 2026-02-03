import { View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  className?: string
}

export const TwDashedSeparator = ({ className }: TProps) => (
  <View className={StyleHelper.mergeStyles('h-auto w-full border border-dashed border-gray-300', className)} />
)
