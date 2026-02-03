import { useEffect } from 'react'

import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleHelper } from '@/helpers/StyleHelper'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const FIRST_PATH_LENGTH = 347.615
const SECOND_PATH_LENGTH = 139.654
const FIRST_DURATION = 800
const SECOND_DURATION = 500

const ScreenLoader = ({ className, ...props }: ViewProps) => {
  const firstPathValue = useSharedValue(FIRST_PATH_LENGTH)
  const secondPathValue = useSharedValue(SECOND_PATH_LENGTH)

  const firstPathProps = useAnimatedProps(() => ({
    strokeDashoffset: firstPathValue.value,
  }))

  const secondPathProps = useAnimatedProps(() => ({
    strokeDashoffset: secondPathValue.value,
  }))

  useEffect(() => {
    firstPathValue.value = withSequence(
      withDelay(SECOND_DURATION, withTiming(0, { duration: FIRST_DURATION, easing: Easing.linear })),
      withTiming(FIRST_PATH_LENGTH, { duration: FIRST_DURATION, easing: Easing.linear }),
      withRepeat(
        withSequence(
          withDelay(SECOND_DURATION * 2, withTiming(0, { duration: FIRST_DURATION, easing: Easing.linear })),
          withTiming(FIRST_PATH_LENGTH, { duration: FIRST_DURATION, easing: Easing.linear })
        ),
        -1
      )
    )

    secondPathValue.value = withRepeat(
      withSequence(
        withTiming(0, { duration: SECOND_DURATION, easing: Easing.linear }),
        withDelay(
          FIRST_DURATION * 2,
          withTiming(SECOND_PATH_LENGTH, { duration: SECOND_DURATION, easing: Easing.linear })
        )
      ),
      -1
    )

    return () => {
      cancelAnimation(firstPathValue)
      cancelAnimation(secondPathValue)
      firstPathValue.value = FIRST_PATH_LENGTH
      secondPathValue.value = SECOND_PATH_LENGTH
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className={StyleHelper.mergeStyles('flex-1 items-center justify-center', className)} {...props}>
      <Svg width={118} height={107} fill="none">
        <AnimatedPath
          stroke="#4CFFB3"
          strokeWidth={3}
          d="M52.9 103 4 54 52.9 5.1 65 17.3 77.3 5.1l12.3 12.2L101.9 5 114 17.3 89.6 41.8 101.9 54l-50.1 50.1"
          strokeDasharray={FIRST_PATH_LENGTH}
          animatedProps={firstPathProps}
        />
        <AnimatedPath
          stroke="#4CFFB3"
          strokeWidth={3}
          d="M52.9 78.4 28.4 54l12.2-12.2L52.9 54l12.2-12.2L77.3 54 51.8 79.4"
          strokeDasharray={SECOND_PATH_LENGTH}
          animatedProps={secondPathProps}
        />
      </Svg>
    </View>
  )
}

export { ScreenLoader }

export default ScreenLoader
