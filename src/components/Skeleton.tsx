import { createContext, useContext, useEffect } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import { View, type ViewProps } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

import { StyleHelper } from '@/helpers/StyleHelper'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
const { theme } = resolveConfig(tailwindConfig)

type TSkeletonContext = { loading: boolean; shimmerSharedValue: SharedValue<number> }
const SkeletonContext = createContext<TSkeletonContext | null>(null)
const useSkeleton = () => {
  const context = useContext(SkeletonContext)
  if (!context) {
    throw new Error('Skeleton compound components cannot be rendered outside the Skeleton.Root component')
  }
  return context
}

type TRootProps = ViewProps & {
  loading?: boolean
}
const Root = ({ loading = true, children, ...props }: TRootProps) => {
  const shimmerSharedValue = useSharedValue(0)

  return (
    <SkeletonContext.Provider value={{ loading, shimmerSharedValue }}>
      <View {...props}>{children}</View>
    </SkeletonContext.Provider>
  )
}

const Group = ({ className, ...props }: ViewProps) => {
  const { loading, shimmerSharedValue } = useSkeleton()

  useEffect(() => {
    if (!loading) {
      cancelAnimation(shimmerSharedValue)
      return
    }

    cancelAnimation(shimmerSharedValue)
    shimmerSharedValue.value = 0

    shimmerSharedValue.value = withRepeat(
      withDelay(
        500,
        withTiming(1, {
          duration: 1500,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    )

    return () => {
      cancelAnimation(shimmerSharedValue)
    }
  }, [loading, shimmerSharedValue])

  if (!loading) {
    return null
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className={StyleHelper.mergeStyles('flex-col gap-2', className)}
      {...props}
    />
  )
}

const Item = ({ className, ...props }: ViewProps) => {
  const { shimmerSharedValue } = useSkeleton()

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerSharedValue.value, [0, 1], [100, -100])

    return {
      transform: [{ translateX: `${translateX}%` }],
    }
  })

  return (
    <View
      className={StyleHelper.mergeStyles('h-full w-full overflow-hidden rounded-md bg-black/5', className)}
      {...props}
    >
      <AnimatedLinearGradient
        colors={[
          'transparent',
          theme.colors.black.DEFAULT + '12',
          theme.colors.black.DEFAULT + '26',
          theme.colors.black.DEFAULT + '12',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          },
          animatedStyle,
        ]}
      />
    </View>
  )
}

type TContentProps = ViewProps & {
  forceMount?: boolean
}
const Content = ({ className, forceMount, ...props }: TContentProps) => {
  const { loading } = useSkeleton()

  if (loading && !forceMount) {
    return null
  }

  return (
    <Animated.View
      className={StyleHelper.mergeStyles('items-center justify-center', className)}
      entering={FadeIn}
      exiting={FadeOut}
      {...props}
    />
  )
}

export const Skeleton = { Root, Group, Item, Content }
