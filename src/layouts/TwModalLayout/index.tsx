import React, { useEffect, useMemo, useRef } from 'react'

import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import type { JSX } from 'react'
import type { ScrollViewProps, ViewProps } from 'react-native'
import { BackHandler, Platform, ScrollView, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  measure,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets'

import { StyleHelper } from '@/helpers/StyleHelper'

import { TwModalLayoutDragBar } from './TwModalLayoutDragBar'
import { TwModalLayoutHeader } from './TwModalLayoutHeader'

type TProps<T extends boolean = false> = {
  full?: boolean
  withoutHeader?: boolean
  withoutScroll?: T
  title?: string
  titleClassName?: string
  onRequestClose?: () => void
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  containerProps?: ViewProps
  contentContainerClassName?: string
} & (T extends false ? ScrollViewProps : ViewProps)

export const PANEL_OFFSET = 20
export const PANEL_BOUNCE_OFFSET = 10
export const MIN_PADDING_BOTTOM = 20

const ANIMATION_DELTA_THRESHOLD = 0.4
const ANIMATION_VELOCITY_THRESHOLD = 200

export const TwModalLayout = <T extends boolean = false>({
  full = true,
  leftElement,
  rightElement,
  title,
  titleClassName,
  withoutHeader,
  children,
  containerProps,
  contentContainerClassName,
  onRequestClose,
  ...props
}: TProps<T>) => {
  const { bottom } = useSafeAreaInsets()
  const navigation = useNavigation()
  const route = useRoute()
  const cameBackByBlurView = useRef(false)

  const paddingBottom = Math.max(bottom, MIN_PADDING_BOTTOM)

  const modalTopOffset = useNavigationState(navigationState => {
    if (!full) return undefined

    const routeIndex = navigationState.routes.findIndex(r => r.key === route.key)

    return PANEL_OFFSET * (routeIndex + 1)
  })

  const animatedRef = useAnimatedRef()

  const offset = useSharedValue(0)
  const prevOffset = useSharedValue(0)

  const handleGoBack = () => {
    if (!navigation.canGoBack() || cameBackByBlurView.current) return
    cameBackByBlurView.current = true
    if (onRequestClose) {
      onRequestClose()
      return
    }
    navigation.goBack()
  }

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          prevOffset.value = offset.value
        })
        .onUpdate(event => {
          const value = prevOffset.value + event.translationY
          offset.value = Math.max(value, -PANEL_BOUNCE_OFFSET)
        })
        .onEnd(event => {
          const measurement = measure(animatedRef)

          if (!measurement) {
            return
          }

          const value = prevOffset.value + event.translationY

          // Close the panel if the user swipes down fast enough or if the panel is more than 40% open
          if (
            value > 0 &&
            (event.velocityY > ANIMATION_VELOCITY_THRESHOLD || value > measurement.height * ANIMATION_DELTA_THRESHOLD)
          ) {
            offset.value = withTiming(measurement.height, undefined, finished => {
              if (!finished) return
              scheduleOnRN(handleGoBack)
            })
            return
          }

          // Otherwise, animate back to the initial position
          offset.value = withSpring(0)
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }))

  const blurAnimatedStyles = useAnimatedStyle(() => {
    const measurement = measure(animatedRef)
    if (!measurement) return { opacity: 1 }

    return {
      opacity: interpolate(offset.value, [0, measurement.height / 2], [1, 0]),
    }
  })

  useEffect(() => {
    const listener = (event: any) => {
      if (route.key !== event.target) return

      event.preventDefault()

      const navigationDispatch = () => {
        navigation.dispatch(event.data.action)
      }

      scheduleOnUI(() => {
        const measurement = measure(animatedRef)
        if (!measurement) return

        offset.value = withTiming(measurement.height, undefined, finished => {
          if (!finished) return
          scheduleOnRN(navigationDispatch)
        })
      })
    }

    navigation.addListener('beforeRemove', listener)

    return () => {
      navigation.removeListener('beforeRemove', listener)
    }
  }, [animatedRef, navigation, offset, route.key])

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack()
      return true
    })

    return () => {
      listener.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View
      {...containerProps}
      className={StyleHelper.mergeStyles('z-50 flex-shrink flex-grow justify-end', containerProps?.className)}
    >
      <Animated.View className="absolute left-0 top-0 h-full w-full" style={blurAnimatedStyles}>
        <BlurView
          className="h-full w-full"
          tint="dark"
          intensity={Platform.OS === 'ios' ? 15 : 90}
          onTouchStart={handleGoBack}
        />
      </Animated.View>

      <Animated.View
        ref={animatedRef}
        entering={SlideInDown.duration(500)}
        style={[
          animatedStyles,
          {
            maxHeight: full ? undefined : '70%',
            width: '100%',
            top: PANEL_BOUNCE_OFFSET,
            flexGrow: full ? 1 : undefined,
            flexShrink: full ? 1 : undefined,
            paddingTop: modalTopOffset,
          },
        ]}
      >
        <View
          className="w-full flex-shrink flex-grow rounded-t-2xl bg-gray-700"
          style={{
            paddingBottom: PANEL_BOUNCE_OFFSET,
            boxShadow: '0px -5px 36px 0px #1215174D',
          }}
        >
          <GestureDetector gesture={pan}>
            <View className="py-5">
              <TwModalLayoutDragBar />

              {!withoutHeader && (
                <TwModalLayoutHeader
                  title={title}
                  titleClassName={titleClassName}
                  leftElement={leftElement}
                  rightElement={rightElement}
                />
              )}
            </View>
          </GestureDetector>

          {props.withoutScroll ? (
            <View className="w-full flex-shrink flex-grow" style={{ paddingBottom: paddingBottom }}>
              <View
                className={StyleHelper.mergeStyles('w-full flex-shrink flex-grow px-5 pb-2', contentContainerClassName)}
              >
                {children}
              </View>
            </View>
          ) : (
            <ScrollView
              contentContainerClassName="w-full flex-grow"
              contentContainerStyle={{ paddingBottom: paddingBottom }}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              disableScrollViewPanResponder
              {...props}
            >
              <View className={StyleHelper.mergeStyles('w-full flex-grow px-5 pb-2', contentContainerClassName)}>
                {children}
              </View>
            </ScrollView>
          )}
        </View>
      </Animated.View>
    </View>
  )
}
