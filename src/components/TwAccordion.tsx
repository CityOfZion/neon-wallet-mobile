import { createContext, forwardRef, useContext, useEffect, useId, useState } from 'react'

import type { JSX, ReactNode } from 'react'
import type { GestureResponderEvent, TouchableOpacityProps, ViewProps } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { measure, useAnimatedRef, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnUI } from 'react-native-worklets'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

type TRootContext = {
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (value: boolean) => void
  nativeID?: string
  disabled?: boolean
}

export type TTwAccordionRootProps = Omit<TRootContext, 'nativeID'> & ViewProps

const TTwAccordionContext = createContext<TRootContext | null>(null)

export const useTwAccordionContext = () => {
  const context = useContext(TTwAccordionContext)
  if (!context) {
    throw new Error('Accordion compound components cannot be rendered outside the TwAccordion.Root component')
  }
  return context
}

const Root = forwardRef<View, TTwAccordionRootProps>(
  ({ value, onValueChange, defaultValue, className, disabled, ...props }, ref) => {
    const nativeID = useId()

    const [internalValue, setInternalValue] = useState(defaultValue || false)

    const isControlled = value !== undefined

    return (
      <TTwAccordionContext.Provider
        value={{
          value: isControlled ? value : internalValue,
          onValueChange: isControlled ? onValueChange : setInternalValue,
          nativeID,
          disabled,
          defaultValue,
        }}
      >
        <View className={StyleHelper.mergeStyles('rounded-md', className)} ref={ref} {...props} />
      </TTwAccordionContext.Provider>
    )
  }
)

export type TTwAccordionTriggerProps = {
  label: ReactNode
  leftElement?: JSX.Element
  iconClassName?: string
} & TouchableOpacityProps

const Trigger = forwardRef<View, TTwAccordionTriggerProps>(
  ({ disabled, className, label, onPress, leftElement, iconClassName, ...props }, ref) => {
    const context = useTwAccordionContext()

    const isDisabled = disabled || context.disabled

    const handlePress = (event: GestureResponderEvent) => {
      context.onValueChange?.(!context.value)
      onPress?.(event)
    }

    return (
      <TouchableOpacity
        {...props}
        ref={ref}
        id={context.nativeID}
        aria-disabled={isDisabled}
        role="button"
        className={StyleHelper.mergeStyles(
          'flex-row items-center gap-x-3 rounded-md bg-gray-300/20 px-4 py-3 disabled:opacity-50',
          className
        )}
        accessibilityState={{
          expanded: context.value,
          disabled: isDisabled,
        }}
        disabled={isDisabled}
        onPress={handlePress}
      >
        {leftElement}

        {ElementHelper.isTextContentValid(label) ? (
          <Text className="font-sans-medium text-asphalt">{label}</Text>
        ) : (
          label
        )}

        <MdChevronRight
          aria-hidden
          className={StyleHelper.mergeStyles('ml-auto size-6 text-white', iconClassName)}
          style={{ transform: [{ rotate: context.value ? '-90deg' : '90deg' }] }}
        />
      </TouchableOpacity>
    )
  }
)

export type TTwAccordionContentProps = ViewProps

const Content = forwardRef<View, TTwAccordionContentProps>(({ children, className, ...props }, ref) => {
  const context = useTwAccordionContext()

  const contentRef = useAnimatedRef<View>()

  const height = useSharedValue(0)

  useEffect(() => {
    scheduleOnUI(() => {
      'worklet'
      if (context.value) {
        const measured = measure(contentRef)
        if (!measured) return

        height.value = withTiming(measured.height, { duration: 200 })
      } else {
        height.value = withTiming(0, { duration: 200 })
      }
    })
  }, [contentRef, context.value, height])

  return (
    <Animated.View
      {...props}
      style={[{ height }]}
      className="relative w-full overflow-hidden"
      aria-hidden={!context.value}
      aria-labelledby={context.nativeID}
      role="region"
      ref={ref}
    >
      <Animated.View ref={contentRef} className={StyleHelper.mergeStyles('absolute top-0 w-full px-3', className)}>
        {children}
      </Animated.View>
    </Animated.View>
  )
})

export const TwAccordion = { Root, Trigger, Content }
