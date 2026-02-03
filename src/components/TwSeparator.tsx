import type { ViewProps } from 'react-native'
import { View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  variant?: 'horiz' | 'vert'
  containerClassName?: string
  withoutContainer?: boolean
} & ViewProps

const InnerSeparator = ({
  variant = 'horiz',
  className,
  ...props
}: Omit<TProps, 'containerClassName' | 'withoutContainer'>) => {
  return (
    <View
      className={StyleHelper.mergeStyles(
        'bg-gray-300/30',
        {
          'h-px w-full': variant === 'horiz',
          'h-full w-0.5': variant === 'vert',
        },
        className
      )}
      {...props}
    />
  )
}

export const TwSeparator = ({ containerClassName, withoutContainer, ...props }: TProps) => {
  return withoutContainer ? (
    <InnerSeparator {...props} />
  ) : (
    <View className={StyleHelper.mergeStyles('w-full', containerClassName)}>
      <InnerSeparator {...props} />
    </View>
  )
}
