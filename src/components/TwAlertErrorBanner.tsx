import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'

type TProps = Omit<ViewProps, 'children'> & {
  message: ReactNode
  messageClassName?: string
  iconClassName?: string
  icon?: JSX.Element
}

export const TwAlertErrorBanner = ({ message, className, messageClassName, iconClassName, icon, ...props }: TProps) => {
  const fixedIcon = icon || <TbAlertTriangle />

  return (
    <View
      className={StyleHelper.mergeStyles('flex-row items-center gap-5 rounded bg-magenta-700 px-5 py-3.5', className)}
      {...props}
    >
      {cloneElement(fixedIcon, {
        className: StyleHelper.mergeStyles(fixedIcon.props.className, 'text-magenta size-6', iconClassName),
        'aria-hidden': true,
      })}

      {ElementHelper.isTextContentValid(message) ? (
        <Text className={StyleHelper.mergeStyles('flex-shrink font-sans-regular text-lg text-white', messageClassName)}>
          {message}
        </Text>
      ) : (
        message
      )}
    </View>
  )
}
