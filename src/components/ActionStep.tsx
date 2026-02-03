import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = ViewProps & {
  title: ReactNode
  description?: string
  leftElement?: JSX.Element
  disabled?: boolean
  error?: boolean
  titleClassName?: string
  headerClassName?: string
  descriptionClassName?: string
}

export const ActionStep = ({
  children,
  disabled,
  description,
  leftElement,
  title,
  className,
  titleClassName,
  headerClassName,
  descriptionClassName,
  error,
  ...props
}: TProps) => (
  <View
    className={StyleHelper.mergeStyles(
      'flex-shrink flex-grow flex-row items-center justify-between px-1.5 py-3',
      className
    )}
    {...props}
  >
    <View
      className={StyleHelper.mergeStyles(
        'flex-shrink flex-grow flex-row items-center gap-2',
        {
          'opacity-50': disabled,
        },
        headerClassName
      )}
    >
      {leftElement && (
        <View className="h-6 w-6 items-center justify-center">
          {cloneElement(leftElement, {
            ...leftElement.props,
            className: StyleHelper.mergeStyles(
              'w-full h-full text-gray-300',
              { 'text-pink': error },
              leftElement.props.className
            ),
          })}
        </View>
      )}

      <View className="flex-shrink flex-grow">
        {typeof title === 'string' ? (
          <Text
            className={StyleHelper.mergeStyles(
              'w-full font-sans-regular text-lg text-white',
              { 'text-pink': error },
              titleClassName
            )}
          >
            {title}
          </Text>
        ) : (
          title
        )}

        {description && (
          <View className="relative">
            <Text
              className={StyleHelper.mergeStyles(
                'absolute w-full font-sans-italic text-sm text-gray-300',
                descriptionClassName
              )}
              numberOfLines={1}
            >
              {description}
            </Text>
          </View>
        )}
      </View>
    </View>

    {children}
  </View>
)
