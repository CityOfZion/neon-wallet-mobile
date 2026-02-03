import { useEffect, useRef } from 'react'

import { Animated, Easing, View } from 'react-native'
import type { SvgProps } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbRefresh from '@/assets/images/tb-refresh.svg'

type TProps = SvgProps & {
  containerClassName?: string
  paused?: boolean
}

// Keep this component using React Native's Animated API for performance reasons.
export const Loader = ({ className, containerClassName, paused, ...props }: TProps) => {
  const rotateAnimated = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startRotation = () => {
      rotateAnimated.setValue(0)
      Animated.loop(
        Animated.timing(rotateAnimated, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    }

    if (!paused) {
      startRotation()
    } else {
      rotateAnimated.stopAnimation()
    }

    return () => {
      rotateAnimated.stopAnimation()
    }
  }, [paused, rotateAnimated])

  const spin = rotateAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  })

  return (
    <View className={StyleHelper.mergeStyles('items-center justify-center', containerClassName)} aria-hidden>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <TbRefresh className={StyleHelper.mergeStyles('h-6 w-6 stroke-[1.5px] text-gray-300', className)} {...props} />
      </Animated.View>
    </View>
  )
}
