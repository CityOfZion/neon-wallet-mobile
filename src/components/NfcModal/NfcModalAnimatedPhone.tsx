import { useEffect } from 'react'

import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

const MIN_ROTATE_X = 0
const MAX_ROTATE_X = 48

export const NfcModalAnimatedPhone = () => {
  const rotateX = useSharedValue(MIN_ROTATE_X)

  const phoneAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateX: rotateX.value + 'deg' }],
    }
  })
  const phoneBackdropAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(rotateX.value, [MIN_ROTATE_X, MAX_ROTATE_X], [0, 90])
    return {
      borderRightWidth: width,
      borderBottomWidth: width,
    }
  })

  useEffect(() => {
    rotateX.value = withRepeat(
      withSequence(
        withDelay(1000, withTiming(MAX_ROTATE_X, { duration: 1000 })),
        withTiming(MIN_ROTATE_X, { duration: 1500 })
      ),
      -1,
      false
    )

    return () => {
      cancelAnimation(rotateX)
      rotateX.value = 0
    }
  }, [rotateX])

  return (
    <Animated.View
      aria-hidden
      className="absolute -bottom-10 h-28 w-14 items-center overflow-hidden rounded-xl border-3 border-blue bg-blue/10"
      style={[phoneAnimatedStyle]}
      exiting={FadeOut}
    >
      <Animated.View
        className="absolute w-full border-b-transparent border-r-blue/20"
        style={[phoneBackdropAnimatedStyle]}
      />

      <View className="mt-1 h-1 w-4 rounded-full bg-blue" />
    </Animated.View>
  )
}
