import { useEffect } from 'react'

import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const PATH_LENGTH = 22

export const NfcModalAnimatedCheck = () => {
  const pathValue = useSharedValue(PATH_LENGTH)

  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: pathValue.value,
  }))

  useEffect(() => {
    pathValue.value = withTiming(0, { duration: 300, easing: Easing.linear })

    return () => {
      cancelAnimation(pathValue)
      pathValue.value = PATH_LENGTH
    }
  }, [pathValue])

  return (
    <Svg
      className="h-20 w-20 text-blue"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <AnimatedPath d="m5 12 5 5L20 7" strokeDasharray={PATH_LENGTH} animatedProps={pathProps} entering={FadeIn} />
    </Svg>
  )
}
