import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { ElementHelper } from '@/helpers/ElementHelper'
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
        className: StyleHelper.mergeStyles(icon.props.className, 'text-neon size-6'),
        'aria-hidden': true,
      })}

      {ElementHelper.isTextContentValid(message) ? (
        <Text className="flex-shrink font-sans-regular text-lg text-white">{message}</Text>
      ) : (
        message
      )}
    </View>
  )
}
