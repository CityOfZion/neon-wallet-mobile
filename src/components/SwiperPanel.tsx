import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, { useState, useRef, Fragment, useMemo, useEffect, useCallback } from 'react'
import {
  Animated,
  PanResponder,
  ScrollView,
  TouchableHighlight,
  useWindowDimensions,
  View,
  LayoutChangeEvent,
} from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import ThemedButton from '~src/components/themed/ThemedButton'
import { TextView, ImageView, LinearLayout, ButtonWithoutFeedbackView } from '~src/styles/styled-components'

export const PANEL_OFFSET = 40
const PANEL_BOUNCE_OFFSET = 10

const ANIMATION_DELTA_THRESHOLD = 0.5
const ANIMATION_VELOCITY_THRESHOLD = 0.5

interface SwiperProps {
  controller?: SwiperController
  fullSize: boolean
  smallerSize?: boolean
  noHeader: boolean
  draggable: boolean
  padding: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  leftButton?: JSX.Element | string
  rightButton?: React.FC | JSX.Element | string
  disableRightButton?: boolean
  onLeftPress?: () => void
  onRightPress?: () => void
  onClose?: () => void
  title?: string
  solidColorBG?: boolean
  darkerSolidColorBG?: boolean
  children?: JSX.Element | JSX.Element[]
  disableDefaultScrollView?: boolean
  subHeader?: React.ReactNode
}

enum State {
  OPEN,
  CLOSED,
}

export interface SwiperController {
  isShowing: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

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

const DragBar = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <View
      style={{
        width: 67,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.background[3],
        alignSelf: 'center',
      }}
    />
  )
}

const Header = (props: SwiperProps) => {
  const [titleWidth, setTitleWidth] = useState<number>()

  function handleLeftPress() {
    if (props.onLeftPress) {
      props.onLeftPress()
    }
  }

  function handleRightPress() {
    if (props.disableRightButton) return

    if (props.onRightPress) {
      props.onRightPress()
    }
  }

  return (
    <LinearLayout justifyContent="space-between" alignItems="center" orientation="horiz" mt="24px" position="relative">
      <ButtonWithoutFeedbackView onPress={handleLeftPress}>
        <LinearLayout>
          <LinearLayout pointerEvents="none">
            {typeof props.leftButton === 'string' ? (
              <ThemedButton label={props.leftButton} textColor="text.0" fontSize="md" rounded={false} flat />
            ) : (
              props.leftButton
            )}
          </LinearLayout>
        </LinearLayout>
      </ButtonWithoutFeedbackView>

      <TextView
        color="text.0"
        fontSize="22px"
        position="absolute"
        left="50%"
        style={titleWidth ? { transform: [{ translateX: (titleWidth / 2) * -1 }] } : undefined}
        onLayout={event => setTitleWidth(event.nativeEvent.layout.width)}
      >
        {props.title}
      </TextView>

      <ButtonWithoutFeedbackView onPress={handleRightPress}>
        <LinearLayout>
          <LinearLayout pointerEvents="none">
            {typeof props.rightButton === 'string' ? (
              <ThemedButton
                label={props.rightButton}
                textColor="text.0"
                fontSize="md"
                rounded={false}
                flat
                disabled={props.disableRightButton}
              />
            ) : (
              props.rightButton
            )}
          </LinearLayout>
        </LinearLayout>
      </ButtonWithoutFeedbackView>
    </LinearLayout>
  )
}

export default function SwiperPanel(props: SwiperProps) {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const swiperController = useSwiperController(true)
  const { height } = useWindowDimensions()

  const [state, setState] = useState(State.CLOSED)
  const [containerHeight, setContainerHeight] = useState<number>()

  const bgOpacity = useRef(new Animated.Value(0))
  const pan = useRef(new Animated.ValueXY({ x: 0, y: height }))
  const scrollView = useRef<ScrollView>(null)

  const paddingLeft = props.paddingLeft ?? props.padding
  const paddingRight = props.paddingRight ?? props.padding
  const paddingTop = props.paddingTop ?? props.padding
  const paddingBottom = props.paddingBottom ?? props.padding

  const controller = props.controller ?? swiperController

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: evt => {
        if (evt.nativeEvent.locationY > 50) {
          return false
        }

        return props.draggable
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
      onPanResponderRelease: (evt, gestureState) => {
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

  const resetScroll = useCallback(() => {
    if (!scrollView.current) return
    scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
  }, [])

  const open = useCallback(() => {
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
    ]).start(() => pan.current.flattenOffset())

    resetScroll()
  }, [resetScroll])

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
    ]).start(() => {
      setState(State.CLOSED)
      setContainerHeight(undefined)

      if (props.onClose) {
        props.onClose()
      }
    })

    resetScroll()
  }, [resetScroll])

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    if (containerHeight) return

    setContainerHeight(event.nativeEvent.layout.height)
  }

  useEffect(() => {
    if (controller.isShowing) {
      setState(State.OPEN)
    } else {
      close()
    }
  }, [controller.isShowing])

  useEffect(() => {
    if (state !== State.OPEN || !containerHeight) return
    open()
  }, [state, containerHeight])

  return state === State.OPEN ? (
    <LinearLayout
      width="100%"
      height={containerHeight ?? '100%'}
      justifyContent="flex-end"
      pointerEvents="box-none"
      onLayout={handleContainerLayout}
    >
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
            flexGrow: props.fullSize || props.smallerSize ? 1 : undefined,
            marginTop: props.fullSize ? PANEL_OFFSET : props.smallerSize ? PANEL_OFFSET * 2 : undefined,
            top: PANEL_BOUNCE_OFFSET,
          },
        ]}
        {...panResponder.current.panHandlers}
      >
        <LinearLayout overflow="hidden" width="100%" flexGrow={1} borderTopLeftRadius={18} borderTopRightRadius={18}>
          <LinearGradient
            colors={
              props.darkerSolidColorBG
                ? [theme.colors.background[14], theme.colors.background[14]]
                : props.solidColorBG
                ? [theme.colors.background[17], theme.colors.background[17]]
                : [theme.colors.background[6], theme.colors.background[7]]
            }
            end={[1, 0.75]}
            style={[
              {
                width: '100%',
                flexGrow: 1,
                paddingBottom,
                paddingTop,
              },
            ]}
          >
            {props.draggable && <DragBar />}
            {!props.noHeader && <Header {...props} />}
            {props.subHeader}
            {props.disableDefaultScrollView ? (
              <LinearLayout
                width="100%"
                weight={1}
                style={{
                  paddingLeft,
                  paddingRight,
                  paddingBottom: PANEL_BOUNCE_OFFSET,
                }}
              >
                {props.children}
              </LinearLayout>
            ) : (
              <ScrollView
                ref={scrollView}
                contentContainerStyle={{
                  paddingLeft,
                  paddingRight,
                  paddingBottom: PANEL_BOUNCE_OFFSET,
                  flexGrow: 1,
                }}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                disableScrollViewPanResponder
                nestedScrollEnabled
              >
                <TouchableHighlight>
                  <>{props.children}</>
                </TouchableHighlight>
              </ScrollView>
            )}
          </LinearGradient>
        </LinearLayout>
      </Animated.View>
    </LinearLayout>
  ) : (
    <></>
  )
}

SwiperPanel.propTypes = {
  fullSize: PropTypes.bool,
  noHeader: PropTypes.bool,
  draggable: PropTypes.bool,
  padding: PropTypes.number,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingBottom: PropTypes.number,
  image: PropTypes.node,
  imageSize: PropTypes.arrayOf(PropTypes.number),
  title: PropTypes.string,
  disableScrolling: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  solidColorBG: PropTypes.bool,
  darkerSolidColorBG: PropTypes.bool,
  disableRightButton: PropTypes.bool,
}

SwiperPanel.defaultProps = {
  isOpen: true,
  fullSize: false,
  noHeader: false,
  draggable: true,
  padding: 20,
  paddingLeft: undefined,
  paddingRight: undefined,
  paddingTop: undefined,
  paddingBottom: undefined,
  disableScrolling: false,
  imageSize: [20, 20],
  solidColorBG: false,
  darkerSolidColorBG: false,
  disableRightButton: false,
}

interface ICloseButton {
  mr?: string
}

export const CloseButton: React.FC<ICloseButton> = ({ mr }) => {
  return (
    <ImageView width={20} height={20} m={mr ?? '8px'} source={require('~src/assets/images/button_close_white.png')} />
  )
}

CloseButton.propTypes = {
  mr: PropTypes.string,
}

export function BackButton(props: { text?: string }) {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        marginRight: 8,
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <ImageView width={13} height={20} source={require('~src/assets/images/icon_arrow_left_white.png')} />
      {props?.text ? (
        <TextView color={theme.colors.text[0]} fontSize={17} fontFamily="regular" alignSelf="center" ml="4px">
          {props.text}
        </TextView>
      ) : undefined}
    </View>
  )
}
