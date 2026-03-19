import { View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../../../tailwind.config'

type TProps = {
  progress: number
}

const fullConfig = resolveConfig(tailwindConfig)

export const OnboardingScreenProgress = (props: TProps) => {
  const progressStyle = useAnimatedStyle(() => {
    const progressPercentage = Math.min(Math.max(props.progress, 0), 100)
    return {
      width: withTiming(`${progressPercentage}%`, { duration: 300 }),
    }
  })

  return (
    <View
      className="h-3.5 w-full rounded-full border border-white/5 p-1"
      style={{
        boxShadow: '-1px -1px 2px 0px #FFFFFF40 inset',
      }}
    >
      <Animated.View
        className="h-full rounded-full bg-yellow"
        style={[progressStyle, { boxShadow: `0px 0px 8px 0px ${fullConfig.theme.colors.neon.DEFAULT}5C` }]}
      />
    </View>
  )
}
