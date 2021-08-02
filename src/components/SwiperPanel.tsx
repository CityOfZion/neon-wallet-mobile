import {useFocusEffect} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
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
  Dimensions,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ThemedButton from '~src/components/themed/ThemedButton'
import {TextView, ImageView, LinearLayout} from '~src/styles/styled-components'

export const PANEL_OFFSET = 50
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
  image?: ImageSourcePropType
  imageSize: [number, number]
  title?: string
  solidColorBG?: boolean
  darkerSolidColorBG?: boolean
  children?: JSX.Element | JSX.Element[]

  // Important! If you wish to disable the default scroll view,
  // make sure your layout has enough padding at the bottom to compensate for the
  // part of the modal that is draggable.
  // You can do so by adding a marginBottom of PANEL_OFFSET.
  // It's not there by default in case the content is a scrollable list, or it would look weird
  // (ask Joao if any questions)
  disableDefaultScrollView?: boolean
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

const DragBar = (props: {noHeader: boolean; mb: number}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <View
      style={{
        width: 67,
        height: 4,
        borderRadius: 2,
        margin: 12,
        backgroundColor: theme.colors.background[3],
        alignSelf: 'center',
        marginBottom: props.noHeader ? props.mb : 0,
      }}
    />
  )
}

const Header = (props: SwiperProps & {mb: number}) => {
  const LETTER_OFFSET = 12
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <LinearLayout
      justifyContent={'space-between'}
      alignItems="baseline"
      orientation="horiz"
      mt="24px"
      mb={props.paddingTop}
    >
      <LinearLayout pl={props.leftButton ? 4 : 7}>
        <AwaitActivity name={'swiperLeft'}>
          <TouchableWithoutFeedback
            onPress={() => props.onLeftPress && props.onLeftPress()}
          >
            <View>
              {/*If prop is plain text, turns it into a styled TextView, otherwise uses the element provided*/}
              {typeof props.leftButton === 'string' ? (
                <LinearLayout ml={-4}>
                  <LinearLayout pointerEvents={'none'}>
                    <ThemedButton
                      label={props.leftButton}
                      textColor={'text.0'}
                      fontSize={'md'}
                      rounded={false}
                      flat={true}
                    />
                  </LinearLayout>
                </LinearLayout>
              ) : (
                props.leftButton
              )}
            </View>
          </TouchableWithoutFeedback>
        </AwaitActivity>
      </LinearLayout>

      <LinearLayout
        pointerEvents={'none'}
        style={{
          position: 'absolute',
          alignSelf: 'flex-start',
          marginLeft:
            Dimensions.get('window').width / 2 -
            (Dimensions.get('window').width / 100) *
              ((props.title ? props.title.length : 0) * 1.5),
          marginTop: 8,
        }}
      >
        {props.image ? (
          <ImageView
            resizeMode="contain"
            height={props.imageSize[0]}
            width={props.imageSize[1]}
            mt={Facade.utils.isIos ? -3 : 2}
            mr="6px"
            source={props.image}
          />
        ) : undefined}

        <TextView color={theme.colors.text[0]} fontSize={23}>
          {props.title}
        </TextView>
      </LinearLayout>

      <LinearLayout pr={4}>
        <AwaitActivity name={'swiperRight'}>
          <TouchableWithoutFeedback
            onPress={() => props.onRightPress && props.onRightPress()}
          >
            <LinearLayout mr={-4}>
              <LinearLayout pointerEvents={'none'}>
                {/*If prop is plain text, turns it into a styled TextView, otherwise uses the element provided*/}
                {typeof props.rightButton === 'string' ? (
                  <ThemedButton
                    label={props.rightButton}
                    textColor={'text.0'}
                    fontSize={'md'}
                    rounded={false}
                    flat={true}
                    disabled={props.disableRightButton}
                  />
                ) : (
                  props.rightButton
                )}
              </LinearLayout>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </AwaitActivity>
      </LinearLayout>
    </LinearLayout>
  )
}

export default function SwiperPanel(props: SwiperProps) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
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
        onStartShouldSetPanResponder: (evt) => {
          if (evt.nativeEvent.locationY > 50) return false

          return props.draggable
        },
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

          // If delta Y is greater than ANIMATION_DELTA_THRESHOLD * PANEL_HEIGHT
          // or movement is faster than ANIMATION_VELOCITY_THRESHOLD, closes panel
          if (
            gestureState.dy >
              (height ?? MAX_HEIGHT) * ANIMATION_DELTA_THRESHOLD ||
            gestureState.vy > ANIMATION_VELOCITY_THRESHOLD
          ) {
            controller.close()
          } else {
            Animated.spring(pan.current, {
              toValue: {x: 0, y: 0},
              useNativeDriver: true,
            }).start()
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

  const resetScroll = () => {
    scrollView.current &&
      scrollView.current.scrollTo({x: 0, y: 0, animated: false})
  }

  const open = () => {
    if (state === State.OPEN) return

    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: {x: 0, y: 0},
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
    setState(State.OPEN)
  }

  const close = () => {
    if (state === State.CLOSED) return

    Animated.parallel([
      Animated.spring(pan.current, {
        toValue: {x: 0, y: height ?? MAX_HEIGHT},
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
      props.onClose && props.onClose()
    })

    resetScroll()
    setState(State.CLOSED)
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
            //@ts-ignore
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

              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              overflow: 'hidden',
            }}
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.height)
            }}
          >
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
                  paddingTop:
                    props.noHeader && !props.draggable ? paddingTop : 0,
                },
                props.fullSize
                  ? {height: MAX_HEIGHT}
                  : props.smallerSize
                  ? {height: MAX_HEIGHT - 46}
                  : {},
              ]}
            >
              {props.draggable ? (
                <DragBar noHeader={props.noHeader} mb={paddingTop} />
              ) : undefined}
              {props.noHeader ? undefined : (
                <Header {...props} mb={paddingBottom} />
              )}
              {props.disableDefaultScrollView ? (
                <LinearLayout
                  width="100%"
                  weight={1}
                  style={{
                    paddingLeft,
                    paddingRight,
                  }}
                >
                  {props.children}
                </LinearLayout>
              ) : (
                <ScrollView
                  ref={scrollView}
                  style={{
                    width: '100%',
                    paddingLeft,
                    paddingRight,
                  }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingBottom: PANEL_OFFSET + paddingBottom,
                  }}
                  alwaysBounceVertical={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  disableScrollViewPanResponder={true}
                  nestedScrollEnabled={true}
                >
                  <TouchableHighlight>
                    <Fragment>{props.children}</Fragment>
                  </TouchableHighlight>
                </ScrollView>
              )}
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

export const CloseButton: React.FC<ICloseButton> = ({mr}) => {
  return (
    <ImageView
      width={20}
      height={20}
      m={mr ?? '8px'}
      source={require('~src/assets/images/button_close_white.png')}
    />
  )
}

CloseButton.propTypes = {
  mr: PropTypes.string,
}

export function BackButton(props: {text?: string}) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
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
