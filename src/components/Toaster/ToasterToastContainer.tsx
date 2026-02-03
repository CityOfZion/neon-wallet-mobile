import { useEffect } from 'react'

import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import type { TToasterToastOptions } from '@/types/toaster'

type TProps = {
  toast: TToasterToastOptions
  onDismiss: (id: string) => void
}

const ENTERING = () => {
  'worklet'

  const animations = {
    opacity: withTiming(1),
    transform: [{ translateY: withTiming(0) }],
  }

  const initialValues = {
    opacity: 0,
    transform: [
      {
        translateY: -50,
      },
    ],
  }

  return {
    initialValues,
    animations,
  }
}

const EXITING = () => {
  'worklet'

  const animations = {
    opacity: withTiming(0),
    transform: [{ translateY: withTiming(-50) }],
  }

  const initialValues = {
    opacity: 1,
    transform: [{ translateY: 0 }],
  }

  return {
    initialValues,
    animations,
  }
}

const DAMPING = 15

const ANIMATION_DELTA_THRESHOLD = 0.4

const ANIMATION_VELOCITY_THRESHOLD = -200

export const ToasterToastContainer = ({ toast, onDismiss }: TProps) => {
  const { width } = useWindowDimensions()

  const translate = useSharedValue(0)
  const prevTranslate = useSharedValue(0)

  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslate.value = translate.value
    })
    .onUpdate(event => {
      const value = prevTranslate.value + event.translationX
      if (value > 0) return

      translate.value = value
    })
    .onFinalize(event => {
      const value = prevTranslate.value + event.translationX

      if (event.velocityX < ANIMATION_VELOCITY_THRESHOLD || value < -width * ANIMATION_DELTA_THRESHOLD) {
        translate.value = withTiming(-width, undefined, () => {
          scheduleOnRN(onDismiss, toast.id)
        })
        return
      }

      translate.value = withSpring(0, { damping: DAMPING })
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translate.value }],
      opacity: interpolate(translate.value, [0, -width], [1, 0]),
    }
  }, [])

  useEffect(() => {
    if (toast.duration === Infinity) return

    const timeout = setTimeout(() => {
      onDismiss(toast.id)
    }, toast.duration)

    return () => {
      clearTimeout(timeout)
      translate.value = 0
      prevTranslate.value = 0
      cancelAnimation(translate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.duration])

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animatedStyle]} layout={LinearTransition}>
        <Animated.View entering={ENTERING} exiting={EXITING}>
          <toast.component message={toast.message} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}
