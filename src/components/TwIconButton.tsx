import React, { cloneElement, forwardRef } from 'react'

import type { JSX } from 'react'
import type { TouchableHighlightProps, View } from 'react-native'
import { TouchableOpacity } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { PressableScale } from './PressableScale'

type TTwIconButtonSize = 'xs' | 'sm' | 'md'
type TTwIconButtonAnimation = 'opacity' | 'scale'

export type TTwIconButtonProps = TouchableHighlightProps & {
  icon: JSX.Element
  size?: TTwIconButtonSize
  animation?: TTwIconButtonAnimation
}

export const TwIconButton = forwardRef<View, TTwIconButtonProps>(
  ({ icon, size = 'md', className, animation = 'scale', ...rest }, ref) => {
    const isXs = size === 'xs'
    const isSm = size === 'sm'
    const isMd = size === 'md'

    const Container = animation === 'scale' ? PressableScale : TouchableOpacity

    return (
      <Container
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
              'size-3.5': isXs,
              'size-5': isSm,
              'size-6': isMd,
            },
            icon.props.className
          ),
        })}
      </Container>
    )
  }
)
