import {useFocusEffect} from '@react-navigation/native'
import {BlurView} from 'expo-blur'
import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState, useRef, Fragment, useMemo} from 'react'
import {
  Animated,
  ImageSourcePropType,
  PanResponder,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import {useSelector} from 'react-redux'

import {TextView, ImageView} from '~src/styles/styled-components'
import {Facade} from '~src/app/Facade'

const PANEL_OFFSET = 50
const ANIMATION_DELTA_THRESHOLD = 50
const ANIMATION_VELOCITY_THRESHOLD = 0.5

interface SwiperProps {
  controller?: SwiperController
  fullSize: boolean
  noHeader: boolean
  draggable: boolean
  padding: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  leftButton?: JSX.Element | string
  rightButton?: JSX.Element | string
  onLeftPress?: () => void
  onRightPress?: () => void
  onClose?: () => void
  image?: ImageSourcePropType
  title?: string
  children?: JSX.Element | JSX.Element[]
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

  function toggle() {
    setIsShowing(!isShowing)
  }

  function open() {
    setIsShowing(true)
  }

  function close() {
    setIsShowing(false)
  }

  return {
    isShowing,
    open,
    close,
    toggle,
  } as SwiperController
}

export default function SwiperPanel(props: SwiperProps) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const MAX_HEIGHT = useWindowDimensions?.().height

  const [height, setHeight] = useState<number>()
  const bgOpacity = useRef(new Animated.Value(0))
  const pan = useRef(new Animated.ValueXY({x: 0, y: height ?? MAX_HEIGHT}))
  const [state, setState] = useState(State.CLOSED)

  const scrollView = useRef<ScrollView>(null)

  const paddingLeft = props.paddingLeft ?? props.padding
  const paddingRight = props.paddingRight ?? props.padding
  const paddingTop = props.paddingTop ?? props.padding
  const paddingBottom = props.paddingBottom ?? props.padding

  const controller = props.controller ?? useSwiperController(true)

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => props.draggable,
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dy > -PANEL_OFFSET) {
            pan.current.setValue({
              x: 0,
              y: gestureState.dy,
            })
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          pan.current.flattenOffset()

          // If delta Y is greater than ANIMATION_DELTA_THRESHOLD or movement is faster than ANIMATION_VELOCITY_THRESHOLD,
          // closes panel
          if (
            gestureState.dy > ANIMATION_DELTA_THRESHOLD ||
            gestureState.vy > ANIMATION_VELOCITY_THRESHOLD
          ) {
            controller.close()
          } else {
            Animated.spring(pan.current, {toValue: {x: 0, y: 0}}).start()
          }
        },
      }),
    []
  )

  useFocusEffect(() => {
    if (controller.isShowing) {
      open()
    } else {
      close()
    }
  })

  function resetScroll() {
    scrollView.current &&
      scrollView.current.scrollTo({x: 0, y: 0, animated: false})
  }

  function open() {
    if (state === State.OPEN) return

    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: {x: 0, y: 0},
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
        friction: 100,
      }),
      Animated.timing(bgOpacity.current, {
        toValue: 1,
        duration: 500,
      }),
    ]).start(() => pan.current.flattenOffset())

    resetScroll()
    setState(State.OPEN)
  }

  function close() {
    if (state === State.CLOSED) return

    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: {x: 0, y: height ?? MAX_HEIGHT},
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
        friction: 100,
      }),
      Animated.timing(bgOpacity.current, {
        toValue: 0,
        duration: 500,
      }),
    ]).start(() => {
      props.onClose && props.onClose()
    })

    resetScroll()
    setState(State.CLOSED)
  }

  function DragBar() {
    return (
      <View
        style={{
          width: 67,
          height: 4,
          borderRadius: 2,
          margin: 12,
          backgroundColor: theme.colors.background[3],
          alignSelf: 'center',
          marginBottom: props.noHeader ? paddingTop : 0,
        }}
      />
    )
  }

  function Header(props: SwiperProps) {
    return (
      <Fragment>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            flexShrink: 0,
            marginTop: 24,
            marginBottom: paddingTop,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => props.onLeftPress && props.onLeftPress()}
          >
            <View
              style={{
                marginLeft: -10,
                paddingLeft: 10,
              }}
            >
              {/*If prop is plain text, turns it into a styled TextView, otherwise uses the element provided*/}
              {typeof props.leftButton === 'string'
                ? TextButton(props.leftButton)
                : props.leftButton}
            </View>
          </TouchableWithoutFeedback>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexShrink: 0,
            }}
          >
            {props.image ? (
              <ImageView
                resizeMode="contain"
                height={20}
                width={20}
                mr="6px"
                source={props.image}
              />
            ) : undefined}

            <TextView
              color={theme.colors.text[0]}
              fontSize={24}
              fontFamily="semibold"
              alignSelf="center"
            >
              {props.title}
            </TextView>
          </View>

          <TouchableWithoutFeedback
            onPress={() => props.onRightPress && props.onRightPress()}
          >
            <View
              style={{
                marginRight: -10,
                paddingRight: 10,
              }}
            >
              {/*If prop is plain text, turns it into a styled TextView, otherwise uses the element provided*/}
              {typeof props.rightButton === 'string'
                ? TextButton(props.rightButton)
                : props.rightButton}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Fragment>
    )
  }

  function TextButton(text: string) {
    return (
      <TextView color={theme.colors.text[0]} fontSize={16} fontFamily="regular">
        {text}
      </TextView>
    )
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
      pointerEvents={'box-none'}
    >
      <Animated.View
        style={{
          opacity: bgOpacity.current,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        pointerEvents={'none'}
      >
        <BlurView
          style={{
            width: '100%',
            height: '100%',
          }}
          tint="dark"
        />
      </Animated.View>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}
        pointerEvents={'box-none'}
      >
        {controller.isShowing ? (
          <TouchableWithoutFeedback onPress={() => controller.close()}>
            <View
              style={{
                width: '100%',
                height: '100%',
                minHeight: PANEL_OFFSET,
                flex: 1,
              }}
            />
          </TouchableWithoutFeedback>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              minHeight: PANEL_OFFSET,
              flex: 1,
            }}
            pointerEvents={'none'}
          />
        )}
        <Animated.View
          style={[
            {transform: pan.current.getTranslateTransform()},
            {
              width: '100%',
              marginBottom: -PANEL_OFFSET,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              width: '100%',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              overflow: 'hidden',
            }}
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.height)
            }}
          >
            <LinearGradient
              colors={[theme.colors.background[6], theme.colors.background[7]]}
              end={[1, 0.75]}
              style={[
                {
                  paddingLeft,
                  paddingRight,
                  paddingTop:
                    props.noHeader && !props.draggable ? paddingTop : 0,
                },
                props.fullSize ? {height: MAX_HEIGHT} : {},
              ]}
            >
              {props.draggable ? DragBar() : undefined}
              {props.noHeader ? undefined : Header(props)}
              <ScrollView
                ref={scrollView}
                style={{
                  width: '100%',
                }}
                contentContainerStyle={{
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <TouchableHighlight>
                  <Fragment>
                    {props.children}
                    <View
                      style={{
                        height: PANEL_OFFSET + paddingBottom,
                      }}
                    />
                  </Fragment>
                </TouchableHighlight>
              </ScrollView>
            </LinearGradient>
          </View>
        </Animated.View>
      </View>
    </View>
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
  title: PropTypes.string,
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
}

export function CancelButton() {
  return (
    <ImageView
      width={20}
      height={20}
      m="8px"
      source={require('~src/assets/images/close.png')}
    />
  )
}

export function BackButton(props: {text?: string}) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
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
      <ImageView
        width={13}
        height={20}
        source={require('~src/assets/images/icon_arrow_left_white.png')}
      />
      {props?.text ? (
        <TextView
          color={theme.colors.text[0]}
          fontSize={17}
          fontFamily="regular"
          alignSelf="center"
          ml="4px"
        >
          {props.text}
        </TextView>
      ) : undefined}
    </View>
  )
}
