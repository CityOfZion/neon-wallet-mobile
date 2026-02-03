import { View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import FaArrowDown from '@/assets/images/fa-arrow-down.svg'

type TProps = {
  contentClassName?: string
  iconContainerClassName?: string
}

export const TwStepSeparator = ({ contentClassName, iconContainerClassName }: TProps) => (
  <View className="relative z-10 h-3 items-center justify-center">
    <View className={StyleHelper.mergeStyles('absolute rounded-full bg-asphalt p-2', contentClassName)}>
      <View className={StyleHelper.mergeStyles('rounded-full bg-gray-600 p-2', iconContainerClassName)}>
        <FaArrowDown aria-hidden className="h-4 w-4 text-gray-200" />
      </View>
    </View>
  </View>
)
