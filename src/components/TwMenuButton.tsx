import React, { cloneElement, Fragment } from 'react'

import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

import { Loader } from './Loader'
import type { TTwButtonProps } from './TwButton'
import { TwButton } from './TwButton'

type TVariant = 'text' | 'contained'

export type TTwMenuButtonProps = Omit<TTwButtonProps, 'variant' | 'iconsOnEdge'> & {
  subtitle?: React.ReactNode
  description?: string
  subtitleClassName?: string
  leftElementContainerClassName?: string
  variant?: TVariant
}

export const TwMenuButton = ({
  label,
  subtitle,
  description,
  labelProps,
  subtitleClassName,
  contentProps,
  className,
  leftElement,
  isLoading,
  variant = 'text',
  leftElementContainerClassName,
  ...props
}: TTwMenuButtonProps) => {
  return (
    <TwButton
      variant="text"
      iconsOnEdge
      contentProps={{
        ...contentProps,
        className: StyleHelper.mergeStyles(
          'py-7',
          {
            'bg-gray-800 px-5': variant === 'contained',
            'px-1': variant === 'text',
          },
          contentProps?.className
        ),
      }}
      className={StyleHelper.mergeStyles('h-auto', className)}
      label={
        <View className="flex-1">
          <View className="flex-row justify-between gap-2">
            {typeof label === 'string' ? (
              <Text
                {...labelProps}
                numberOfLines={1}
                className={StyleHelper.mergeStyles(
                  'flex-shrink font-sans-regular text-lg text-white',
                  labelProps?.className
                )}
              >
                {label}
              </Text>
            ) : (
              label
            )}

            {subtitle && (
              <Fragment>
                {typeof subtitle === 'string' ? (
                  <Text
                    className={StyleHelper.mergeStyles('font-sans-regular text-lg text-gray-400', subtitleClassName)}
                  >
                    {subtitle}
                  </Text>
                ) : (
                  subtitle
                )}
              </Fragment>
            )}
          </View>

          {description && (
            <Text className="font-sans-medium text-base text-gray-400" numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>
      }
      rightElement={isLoading ? <Loader /> : <MdChevronRight className="text-gray-300" />}
      disabled={isLoading}
      leftElement={
        leftElement ? (
          <View
            className={StyleHelper.mergeStyles('h-6 w-6 items-center justify-center', leftElementContainerClassName)}
          >
            {cloneElement(leftElement, {
              ...leftElement.props,
              className: StyleHelper.mergeStyles('text-neon', leftElement.props.className),
            })}
          </View>
        ) : undefined
      }
      {...props}
    />
  )
}
