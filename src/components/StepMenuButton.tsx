import { cloneElement } from 'react'

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

import type { TTwButtonProps } from './TwButton'
import { TwButton } from './TwButton'

export type TStepMenuButtonProps = Omit<TTwButtonProps, 'variant' | 'iconsOnEdge'> & {
  value?: ReactNode
  active?: boolean
}

export const StepMenuButton = ({
  className,
  leftElement,
  labelProps,
  label,
  contentProps,
  value,
  active,
  disabled,
  ...props
}: TStepMenuButtonProps) => {
  const isDisabled = disabled || (!active && !value)

  return (
    <TwButton
      variant="text"
      iconsOnEdge
      contentProps={{
        ...contentProps,
        className: StyleHelper.mergeStyles('py-5 px-1 h-full', contentProps?.className),
      }}
      label={
        <View className="flex-1 gap-1">
          <Text
            {...labelProps}
            numberOfLines={1}
            className={StyleHelper.mergeStyles(
              'flex-shrink font-sans-regular text-lg text-neon',
              { 'text-gray-100': !!value || isDisabled },
              labelProps?.className
            )}
          >
            {label}
          </Text>

          {ElementHelper.isTextContentValid(value) ? (
            <Text className="font-sans-regular text-lg text-white" numberOfLines={1} ellipsizeMode="middle">
              {value}
            </Text>
          ) : (
            value
          )}
        </View>
      }
      className={StyleHelper.mergeStyles('h-auto', className)}
      leftElement={
        leftElement ? (
          <View className="mt-1 h-full">
            {cloneElement(leftElement, {
              className: StyleHelper.mergeStyles(
                'size-6 text-white',
                { 'text-blue': !!value && !isDisabled },
                leftElement.props.className
              ),
            })}
          </View>
        ) : undefined
      }
      rightElement={
        <MdChevronRight
          aria-hidden
          className={StyleHelper.mergeStyles('size-6 text-white', { 'text-neon': !!value && !isDisabled })}
        />
      }
      disabled={isDisabled}
      {...props}
    />
  )
}
