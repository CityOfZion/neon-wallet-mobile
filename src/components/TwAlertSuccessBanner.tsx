import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = Omit<ViewProps, 'children'> & {
  message: ReactNode
  icon: JSX.Element
}

export const TwAlertSuccessBanner = ({ message, className, icon, ...props }: TProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles('flex-row items-center gap-5 rounded bg-green-700 px-5 py-3.5', className)}
      {...props}
    >
      {cloneElement(icon, {
        className: StyleHelper.mergeStyles(icon.props.className, 'text-neon h-6 w-6'),
        'aria-hidden': true,
      })}

      {typeof message === 'object' ? (
        message
      ) : (
        <Text className="flex-shrink font-sans-regular text-lg text-white">{message}</Text>
      )}
    </View>
  )
}
