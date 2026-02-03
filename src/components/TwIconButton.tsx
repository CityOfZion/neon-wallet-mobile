import React, { cloneElement, forwardRef } from 'react'

import type { JSX } from 'react'
import type { TouchableHighlightProps, View } from 'react-native'
import { TouchableOpacity } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TTwSize = 'xs' | 'sm' | 'md'

export type TTwIconButtonProps = TouchableHighlightProps & {
  icon: JSX.Element
  size?: TTwSize
}

export const TwIconButton = forwardRef<View, TTwIconButtonProps>(({ icon, size = 'md', className, ...rest }, ref) => {
  const isXs = size === 'xs'
  const isSm = size === 'sm'
  const isMd = size === 'md'

  return (
    <TouchableOpacity
      ref={ref}
      className={StyleHelper.mergeStyles(
        'items-center justify-center disabled:opacity-50',
        {
          'p-1.5': isXs,
          'p-2': isSm,
          'p-3': isMd,
        },
        className
      )}
      {...rest}
    >
      {cloneElement(icon, {
        ...icon.props,
        className: StyleHelper.mergeStyles(
          'text-white',
          {
            'w-3.5 h-3.5': isXs,
            'w-5 h-5': isSm,
            'w-6 h-6': isMd,
          },
          icon.props.className
        ),
      })}
    </TouchableOpacity>
  )
})
