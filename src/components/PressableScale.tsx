import { useEffect } from 'react'

import type { GestureResponderEvent, PressableProps } from 'react-native'
import { Pressable } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const SPRING_CONFIG = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
}

const TIMING_CONFIG = {
  duration: 150,
}

const SCALE_VALUE = 0.95
const LONG_PRESS_SCALE_VALUE = 1.05

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type TProps = PressableProps & {
  opacity?: number
}

export const PressableScale = ({ onLongPress, onPress, disabled, style, opacity, ...props }: TProps) => {
  const scaleSharedValue = useSharedValue(1)
  const opacitySharedValue = useSharedValue(opacity || 1)

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scaleSharedValue.value }],
      opacity: opacitySharedValue.value,
    }),
    [scaleSharedValue, opacitySharedValue]
  )

  const handlePressIn = () => {
    cancelAnimation(scaleSharedValue)
    cancelAnimation(opacitySharedValue)

    scaleSharedValue.value = withTiming(SCALE_VALUE, TIMING_CONFIG)
    if (!opacity) {
      opacitySharedValue.value = withTiming(0.8, TIMING_CONFIG)
    }
  }

  const handlePressOut = () => {
    cancelAnimation(scaleSharedValue)
    cancelAnimation(opacitySharedValue)

    scaleSharedValue.value = withSpring(1, SPRING_CONFIG)
    if (!opacity) {
      opacitySharedValue.value = withSpring(1, SPRING_CONFIG)
    }
  }

  const handleLongPress = (event: GestureResponderEvent) => {
    scaleSharedValue.value = withSpring(LONG_PRESS_SCALE_VALUE, SPRING_CONFIG)
    onLongPress?.(event)
  }

  useEffect(() => {
    if (opacity) return

    if (disabled) {
      opacitySharedValue.value = withTiming(0.5, TIMING_CONFIG)
    } else {
      opacitySharedValue.value = withTiming(1, TIMING_CONFIG)
    }
  }, [disabled, opacity, opacitySharedValue])

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      onPress={onPress}
      disabled={disabled}
      delayLongPress={500}
      {...props}
    />
  )
}
