import React, { useContext, useEffect, useId } from 'react'

import * as SwitchPrimitive from '@rn-primitives/switch'
import { Text, type TextProps, View, type ViewProps } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { StyleHelper } from '@/helpers/StyleHelper'

type TRootContext = {
  id?: string
}

const SwitchContext = React.createContext<TRootContext>({})

const useSwitch = () => useContext(SwitchContext)

const Root = React.forwardRef<View, ViewProps>(({ className, children, ...props }, ref) => {
  const id = useId()

  return (
    <SwitchContext.Provider value={{ id }}>
      <View ref={ref} className={StyleHelper.mergeStyles('flex-row items-center gap-x-2.5', className)} {...props}>
        {children}
      </View>
    </SwitchContext.Provider>
  )
})

const THUMB_OFFSET_ON = 16
const THUMB_OFFSET_OFF = 0

const Control = React.forwardRef<SwitchPrimitive.RootRef, SwitchPrimitive.RootProps>(
  ({ checked, onCheckedChange, disabled = false, className, ...props }, ref) => {
    const { id } = useSwitch()

    const offset = useSharedValue(checked ? THUMB_OFFSET_ON : THUMB_OFFSET_OFF)

    useEffect(() => {
      offset.value = withTiming(checked ? THUMB_OFFSET_ON : THUMB_OFFSET_OFF, { duration: 100 })
    }, [checked, offset])

    const thumbStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: offset.value }],
    }))

    return (
      <SwitchPrimitive.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-labelledby={id}
        className={StyleHelper.mergeStyles(
          'h-5 w-9 items-start justify-center rounded-full px-0.5',
          {
            'bg-green': checked,
            'bg-gray-700': !checked,
            'opacity-50': disabled,
          },
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb asChild>
          <Animated.View className="size-4 rounded-full bg-white" style={thumbStyle} />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    )
  }
)

const Label = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => {
  const { id } = useSwitch()

  return (
    <Text
      ref={ref}
      nativeID={id}
      className={StyleHelper.mergeStyles('font-sans-regular text-xs text-gray-100', className)}
      {...props}
    />
  )
})

export const Switch = { Root, Control, Label }
