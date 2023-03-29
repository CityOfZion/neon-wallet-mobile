import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import I18n from 'i18n-js'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Animated, PanResponder, Platform, ScrollView, useWindowDimensions, View, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { applicationConfig } from '../config/ApplicationConfig'
import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { TextView, ImageView, LinearLayout, ButtonWithoutFeedbackView } from '~src/styles/styled-components'

export interface SwiperController {
  isShowing: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export interface SwiperProps {
  controller?: SwiperController
  size?: 'full' | 'small' | 'dinamic'
  withoutHeader?: boolean
  draggable?: boolean
  leftButton?: JSX.Element
  rightButton?: JSX.Element
  onClose?: () => void
  title?: string
  children?: React.ReactNode | React.ReactNode[]
  withoutScrollView?: boolean
  subheader?: React.ReactNode
  contentStyle?: ViewStyle
}

type CloseButtonProps = {
  onPress?: () => void
}

type BackButtonProps = {
  withText?: boolean
  onPress?: () => void
}

type LabelButtonProps = {
  label: string
  disabled?: boolean
  onPress?: () => void
}

enum State {
  OPEN,
  CLOSED,
}

export const PANEL_OFFSET = 30
export const PANEL_BOUNCE_OFFSET = 10
export const DEFAULT_PADDING = 20
export const DEFAULT_PADDING_BOTTOM = DEFAULT_PADDING + (Platform.OS === 'ios' ? 25 : 0)

const ANIMATION_DELTA_THRESHOLD = 0.5
const ANIMATION_VELOCITY_THRESHOLD = 0.5

export const useSwiperController = (initial: boolean = false) => {
  const [isShowing, setIsShowing] = useState(initial)

  const toggle = useCallback(() => {
    setIsShowing(prevState => !prevState)
  }, [])

  const open = useCallback(() => {
    setIsShowing(true)
  }, [])

  const close = useCallback(() => {
    setIsShowing(false)
  }, [])

  return {
    isShowing,
    open,
    close,
    toggle,
  } as SwiperController
}

export const CloseButton = ({ onPress }: CloseButtonProps) => {
  return (
    <ButtonWithoutFeedbackView onPress={onPress}>
      <LinearLayout style={{ padding: DEFAULT_PADDING }}>
        <ImageView
          width={Normalize.scale(20)}
          height={Normalize.scale(20)}
          source={require('~src/assets/images/button_close_white.png')}
        />
      </LinearLayout>
    </ButtonWithoutFeedbackView>
  )
}

export const BackButton = ({ withText = true, onPress }: BackButtonProps) => {
  return (
    <ButtonWithoutFeedbackView onPress={onPress}>
      <LinearLayout orientation="horiz" style={{ padding: DEFAULT_PADDING }}>
        <ImageView
          width={Normalize.scale(20)}
          height={Normalize.scale(20)}
          source={require('~src/assets/images/icon_arrow_left_white.png')}
          resizeMode="contain"
        />
        {withText && (
          <TextView color="text.0" fontSize="16px" fontFamily="regular" alignSelf="center" ml="4px">
            {I18n.t('app.back')}
          </TextView>
        )}
      </LinearLayout>
    </ButtonWithoutFeedbackView>
  )
}

export const LabelButton = ({ label, disabled, onPress }: LabelButtonProps) => {
  return (
    <ButtonWithoutFeedbackView onPress={onPress} disabled={disabled}>
      <TextView color="text.0" fontSize="16px" fontFamily="regular" style={{ padding: DEFAULT_PADDING }}>
        {label}
      </TextView>
    </ButtonWithoutFeedbackView>
  )
}

const DragBar = () => {
  return <LinearLayout width="68px" height="4px" borderRadius="2px" backgroundColor="background.3" alignSelf="center" />
}

const Header = (props: Pick<SwiperProps, 'leftButton' | 'rightButton' | 'title'>) => {
  return (
    <LinearLayout alignItems="center" orientation="horiz" mt="24px" position="relative">
      <TextView color="text.0" fontSize="22px" flex={1} textAlign="center">
        {props.title}
      </TextView>

      <LinearLayout position="absolute" left="0px">
        {props.leftButton}
      </LinearLayout>

      <LinearLayout position="absolute" right="0px">
        {props.rightButton}
      </LinearLayout>
    </LinearLayout>
  )
}

export default function SwiperPanel({ draggable = true, size = 'full', contentStyle, ...props }: SwiperProps) {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const swiperController = useSwiperController(true)
  const { height } = useWindowDimensions()

  const [state, setState] = useState(State.CLOSED)

  const bgOpacity = useRef(new Animated.Value(0))
  const pan = useRef(new Animated.ValueXY({ x: 0, y: height }))

  const controller = props.controller ?? swiperController

  const panelOffset =
    size === 'dinamic'
      ? undefined
      : applicationConfig.statusBarHeight + size === 'full'
      ? PANEL_OFFSET
      : PANEL_OFFSET * 2

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return draggable
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy < -PANEL_BOUNCE_OFFSET) return

        if (gestureState.dy < 0) {
          pan.current.setValue({
            x: 0,
            y: gestureState.dy / 2,
          })
          return
        }

        pan.current.setValue({
          x: 0,
          y: gestureState.dy,
        })
      },
      onPanResponderRelease: (_evt, gestureState) => {
        pan.current.flattenOffset()

        // If delta Y is greater than ANIMATION_DELTA_THRESHOLD * PANEL_HEIGHT
        // or movement is faster than ANIMATION_VELOCITY_THRESHOLD, closes panel
        if (gestureState.dy > height * ANIMATION_DELTA_THRESHOLD || gestureState.vy > ANIMATION_VELOCITY_THRESHOLD) {
          controller.close()
        } else {
          Animated.spring(pan.current, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start()
        }
      },
    })
  )

  const open = useCallback(() => {
    setState(State.OPEN)
    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: { x: 0, y: 0 },
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
        friction: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity.current, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      pan.current.flattenOffset()
    })
  }, [])

  const close = useCallback(() => {
    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: { x: 0, y: height },
        restSpeedThreshold: 150,
        restDisplacementThreshold: 100,
        friction: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return

      setState(State.CLOSED)

      if (props.onClose) {
        props.onClose()
      }
    })
  }, [])

  useEffect(() => {
    if (controller.isShowing) {
      open()
    } else {
      close()
    }
  }, [controller.isShowing])

  return state === State.OPEN ? (
    <LinearLayout width="100%" height="100%" justifyContent="flex-end" pointerEvents="box-none">
      <Animated.View
        style={{
          opacity: bgOpacity.current,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <ButtonWithoutFeedbackView onPress={controller.close} width="100%" height="100%">
          <BlurView
            style={{
              width: '100%',
              height: '100%',
            }}
            tint="dark"
          />
        </ButtonWithoutFeedbackView>
      </Animated.View>

      <Animated.View
        style={[
          { transform: pan.current.getTranslateTransform() },
          {
            width: '100%',
            top: PANEL_BOUNCE_OFFSET,
            flexGrow: size !== 'dinamic' ? 1 : undefined,
            flexShrink: size !== 'dinamic' ? 1 : undefined,
            paddingTop: panelOffset,
          },
        ]}
      >
        <LinearLayout
          overflow="hidden"
          width="100%"
          flexGrow={1}
          flexShrink={1}
          borderTopLeftRadius={18}
          borderTopRightRadius={18}
        >
          <LinearGradient
            colors={[theme.colors.background[17], theme.colors.background[17]]}
            end={[1, 0.75]}
            style={[
              {
                paddingBottom: PANEL_BOUNCE_OFFSET,
                width: '100%',
                flexGrow: 1,
                flexShrink: 1,
              },
            ]}
          >
            <LinearLayout
              {...panResponder.current.panHandlers}
              style={{ paddingVertical: DEFAULT_PADDING, backgroundColor: 'transparent' }}
            >
              {draggable && <DragBar />}
              {!props.withoutHeader && <Header {...props} />}
              {props.subheader}
            </LinearLayout>

            {props.withoutScrollView ? (
              <View
                style={{
                  padding: DEFAULT_PADDING,
                  paddingBottom: DEFAULT_PADDING_BOTTOM,
                  ...contentStyle,
                  flexGrow: 1,
                  flexShrink: 1,
                  width: '100%',
                }}
              >
                {props.children}
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  padding: DEFAULT_PADDING,
                  paddingBottom: DEFAULT_PADDING_BOTTOM,
                  ...contentStyle,
                  flexGrow: 1,
                  width: '100%',
                }}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                disableScrollViewPanResponder
                nestedScrollEnabled
              >
                {props.children}
              </ScrollView>
            )}
          </LinearGradient>
        </LinearLayout>
      </Animated.View>
    </LinearLayout>
  ) : null
}
