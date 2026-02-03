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

export const PressableScale = ({ onLongPress, onPress, disabled, style, ...props }: PressableProps) => {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }),
    [scale, opacity]
  )

  const handlePressIn = () => {
    cancelAnimation(scale)
    cancelAnimation(opacity)
    scale.value = withTiming(SCALE_VALUE, TIMING_CONFIG)
    opacity.value = withTiming(0.8, TIMING_CONFIG)
  }

  const handlePressOut = () => {
    cancelAnimation(scale)
    cancelAnimation(opacity)
    scale.value = withSpring(1, SPRING_CONFIG)
    opacity.value = withSpring(1, SPRING_CONFIG)
  }

  const handleLongPress = (event: GestureResponderEvent) => {
    scale.value = withSpring(LONG_PRESS_SCALE_VALUE, SPRING_CONFIG)
    onLongPress?.(event)
  }

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
