import { View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../../../tailwind.config'

type TDotProps = {
  activePage: SharedValue<number>
  page: number
  totalPages: number
}

type TProps = {
  activePage: SharedValue<number>
  totalPages: number
}

const fullConfig = resolveConfig(tailwindConfig)

const Dot = ({ activePage, page, totalPages }: TDotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const currentPage = activePage.value

    const distance = Math.min(
      Math.abs(currentPage - page),
      Math.abs(currentPage - page + totalPages),
      Math.abs(currentPage - page - totalPages)
    )

    const isNearby = distance < 1.5

    if (!isNearby) {
      return {
        backgroundColor: fullConfig.theme.colors.white.DEFAULT,
        transform: [{ scale: 1 }],
        width: 8,
      }
    }

    const progress = Math.max(0, 1 - distance)

    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      [fullConfig.theme.colors.white.DEFAULT, fullConfig.theme.colors.neon.DEFAULT]
    )

    const scale = interpolate(progress, [0, 1], [1, 1.3], Extrapolation.CLAMP)
    const width = interpolate(progress, [0, 1], [8, 16], Extrapolation.CLAMP)

    return {
      backgroundColor,
      transform: [{ scale }],
      width,
    }
  })

  return <Animated.View className="h-2 rounded-full" style={animatedStyle} />
}

export const OnboardingScreenPagination = ({ activePage, totalPages }: TProps) => {
  const data = Array.from({ length: totalPages }, (_, index) => index)

  return (
    <View className="w-full flex-row items-center justify-center gap-2 py-4">
      {data.map((_, index) => (
        <Dot key={`onboarding-pagination-dot-${index}`} activePage={activePage} totalPages={totalPages} page={index} />
      ))}
    </View>
  )
}
