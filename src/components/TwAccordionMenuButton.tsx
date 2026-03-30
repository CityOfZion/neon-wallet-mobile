import { useState } from 'react'

import type { JSX, ReactNode } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

import type { TTwButtonProps } from './TwButton'
import { TwButton } from './TwButton'

type TProps = TTwButtonProps & {
  subtitle?: string | JSX.Element
  description?: string
  subtitleClassName?: string
  bottomElement?: JSX.Element
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const TwAccordionMenuButton = ({
  label,
  subtitle,
  description,
  labelProps,
  subtitleClassName,
  contentProps,
  className,
  children,
  bottomElement,
  open,
  onOpenChange,
  ...props
}: TProps) => {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined
  open = isControlled ? open : internalOpen
  onOpenChange = isControlled ? onOpenChange : setInternalOpen

  const height = useSharedValue(0)

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(open), {
      duration: 200,
    })
  )

  const animatedStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }))

  const onPress = (event: GestureResponderEvent) => {
    onOpenChange?.(!open)
    props?.onPress?.(event)
  }

  return (
    <View className="w-full">
      <TwButton
        variant="text"
        iconsOnEdge
        contentProps={{
          ...contentProps,
          className: StyleHelper.mergeStyles('px-1 py-6', contentProps?.className),
        }}
        className={StyleHelper.mergeStyles('h-auto rounded-none', { 'bg-gray-300/15': open }, className)}
        label={
          <View className="min-h-[28px] flex-1">
            <View className="flex-1 flex-row items-center justify-between">
              <Text
                {...labelProps}
                className={StyleHelper.mergeStyles('font-sans-regular text-lg text-white', labelProps?.className)}
              >
                {label}
              </Text>

              {ElementHelper.isTextContentValid(subtitle) ? (
                <Text className={StyleHelper.mergeStyles('font-sans-bold text-base text-gray-400', subtitleClassName)}>
                  {subtitle}
                </Text>
              ) : (
                subtitle
              )}
            </View>

            {description && <Text className="font-sans-medium text-base text-gray-400">{description}</Text>}
          </View>
        }
        rightElement={
          <MdChevronRight
            aria-hidden
            className={StyleHelper.mergeStyles('text-gray-300', { 'text-white': open })}
            style={{ transform: [{ rotate: `${open ? '-' : ''}90deg` }] }}
          />
        }
        onPress={onPress}
        {...props}
      />

      {bottomElement}

      <Animated.View className="w-full overflow-hidden" style={[animatedStyle]}>
        <View
          className="absolute flex w-full"
          onLayout={event => {
            height.value = event.nativeEvent.layout.height
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  )
}
