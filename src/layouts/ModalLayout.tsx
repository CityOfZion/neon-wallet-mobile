import { Children, createContext, isValidElement, useContext, useEffect, useMemo } from 'react'

import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent, ScrollViewProps, TextProps, ViewProps } from 'react-native'
import { BackHandler, Platform, ScrollView, Text, View } from 'react-native'
import type { PanGesture } from 'react-native-gesture-handler'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, type KeyboardAvoidingViewProps } from 'react-native-keyboard-controller'
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
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets'

import { type TTwButtonProps, TwButton } from '@/components/TwButton'
import { type TTwIconButtonProps, TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import { usePressOnce } from '@/hooks/usePressOnce'

import MdClose from '@/assets/images/md-close.svg'

const PANEL_OFFSET = 20
const PANEL_BOUNCE_OFFSET = 10
const ANIMATION_DELTA_THRESHOLD = 0.4
const ANIMATION_VELOCITY_THRESHOLD = 200

type TModalLayoutContext = {
  pan: PanGesture
  modalTopOffset?: number
}

const ModalLayoutContext = createContext<TModalLayoutContext | null>(null)

const useModalLayoutContext = () => {
  const context = useContext(ModalLayoutContext)

  if (!context) {
    throw new Error('useModalLayoutContext must be used within ModalLayout')
  }

  return context
}

type TRootProps = {
  full?: boolean
  disableSwipeToClose?: boolean
  onRequestClose?: () => void
  className?: string
  children?: ReactNode
}

const Root = ({ full = true, disableSwipeToClose = false, onRequestClose, className, children }: TRootProps) => {
  const navigation = useNavigation()
  const route = useRoute()

  const animatedRef = useAnimatedRef()
  const offset = useSharedValue(0)
  const prevOffset = useSharedValue(0)

  const modalTopOffset = useNavigationState(navigationState => {
    if (!full) return undefined

    const routeIndex = navigationState.routes.findIndex(r => r.key === route.key)

    return PANEL_OFFSET * (routeIndex + 1)
  })

  const [, handleGoBack] = usePressOnce(() => {
    if (!navigation.canGoBack()) return

    if (onRequestClose) {
      onRequestClose()
      return
    }

    navigation.goBack()
  })

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disableSwipeToClose)
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

          offset.value = withSpring(0)
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disableSwipeToClose]
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
    <ModalLayoutContext.Provider value={{ pan, modalTopOffset }}>
      <View className={StyleHelper.mergeStyles('z-50 flex-shrink flex-grow justify-end', className)}>
        <Animated.View
          importantForAccessibility="no-hide-descendants"
          className="absolute left-0 top-0 size-full"
          style={blurAnimatedStyles}
        >
          <BlurView
            className="size-full"
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
            accessibilityViewIsModal
            className="w-full flex-shrink flex-grow rounded-t-2xl bg-gray-700"
            style={{
              paddingBottom: PANEL_BOUNCE_OFFSET,
              boxShadow: '0px -5px 36px 0px #1215174D',
            }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </ModalLayoutContext.Provider>
  )
}

const Header = ({ className, children }: ViewProps) => {
  const { pan } = useModalLayoutContext()

  return (
    <GestureDetector gesture={pan}>
      <View className="py-5">
        <View accessible={false} aria-hidden className="h-1 w-[68px] self-center rounded-sm bg-gray-300" />

        {children && (
          <View
            accessibilityRole="header"
            className={StyleHelper.mergeStyles('relative mt-6 flex-row items-center', className)}
          >
            {children}
          </View>
        )}
      </View>
    </GestureDetector>
  )
}

const Title = ({ className, accessibilityRole = 'header', ...props }: TextProps) => {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      numberOfLines={1}
      className={StyleHelper.mergeStyles(
        'mx-auto max-w-[75%] flex-1 text-center font-sans-regular text-1xl text-gray-100',
        className
      )}
      {...props}
    />
  )
}

type TButtonPosition = 'left' | 'right'
type TButtonContentProps = ViewProps & { position: TButtonPosition }
const ButtonContent = ({ className, children, position, ...props }: TButtonContentProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles(
        'absolute flex-row',
        { 'right-0': position === 'right', 'left-0': position === 'left' },
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

type TButtonProps = TTwButtonProps & { position: TButtonPosition }
const Button = ({ contentProps, labelProps, position, className, ...props }: TButtonProps) => {
  return (
    <TwButton
      className={StyleHelper.mergeStyles(
        'absolute',
        { 'right-0': position === 'right', 'left-0': position === 'left' },
        className
      )}
      contentProps={{ ...contentProps, className: StyleHelper.mergeStyles('px-5', contentProps?.className) }}
      labelProps={{ ...labelProps, className: StyleHelper.mergeStyles('text-base', labelProps?.className) }}
      variant="text"
      {...props}
    />
  )
}

const CloseButton = ({ className, onPress, ...props }: Omit<TTwIconButtonProps, 'icon'>) => {
  const navigation = useNavigation()
  const { t } = useTranslation('components', { keyPrefix: 'modalLayout' })

  const [isGoingBack, startGoBack] = usePressOnce((event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event)
      return
    }

    navigation.goBack()
  })

  return (
    <TwIconButton
      accessibilityRole="button"
      className={StyleHelper.mergeStyles('absolute right-0', className)}
      icon={<MdClose className="text-white" aria-hidden />}
      onPress={startGoBack}
      disabled={isGoingBack}
      aria-label={t('labels.closeButton')}
      {...props}
    />
  )
}

const ScrollContent = ({ className, contentContainerClassName, ...props }: ScrollViewProps) => {
  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      disableScrollViewPanResponder
      className={StyleHelper.mergeStyles('flex-shrink flex-grow', className)}
      contentContainerClassName={StyleHelper.mergeStyles(
        'w-full flex-grow px-5 pb-safe-or-8',
        contentContainerClassName
      )}
      {...props}
    />
  )
}

const ViewContent = ({ className, ...props }: ViewProps) => {
  return (
    <View className={StyleHelper.mergeStyles('pb-safe-or-8 w-full flex-shrink flex-grow px-5', className)} {...props} />
  )
}

const KeyboardAvoidingContent = ({ className, children, ...props }: KeyboardAvoidingViewProps) => {
  const { modalTopOffset } = useModalLayoutContext()

  const childrenArray = Children.toArray(children)
  const scrollChildren = childrenArray.filter(child => !isValidElement(child) || child.type !== KeyboardAvoidingArea)
  const areaChildren = childrenArray.filter(child => isValidElement(child) && child.type === KeyboardAvoidingArea)

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={20 + (modalTopOffset ?? 0)}
      className={StyleHelper.mergeStyles('mb-safe-or-8 w-full flex-shrink flex-grow', className)}
      {...(props as any)}
    >
      <ScrollView className="w-full flex-shrink flex-grow" contentContainerClassName="w-full flex-grow px-5">
        {scrollChildren}
      </ScrollView>

      {areaChildren}
    </KeyboardAvoidingView>
  )
}

const KeyboardAvoidingArea = ({ className, ...props }: ViewProps) => {
  return <View className={StyleHelper.mergeStyles('px-5 py-3', className)} {...props} />
}

export const ModalLayout = {
  Root,
  Header,
  ScrollContent,
  ViewContent,
  ButtonContent,
  Button,
  CloseButton,
  Title,
  KeyboardAvoidingContent,
  KeyboardAvoidingArea,
}
