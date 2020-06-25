import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {BlurView} from 'expo-blur'
import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState, useRef, Fragment} from 'react'
import {
  Animated,
  ImageSourcePropType,
  PanResponder,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useSelector} from 'react-redux'

import {RootState} from '~src/store/reducers/root'
import {TextView, ImageView} from '~src/styles/styled-components'

const PANEL_OFFSET = 50
const ANIMATION_DELTA_THRESHOLD = 50
const ANIMATION_VELOCITY_THRESHOLD = 0.5

interface Props {
  padding: number
  leftButton?: JSX.Element
  rightButton?: JSX.Element
  onLeftPress?: () => void
  onRightPress?: () => void
  image: ImageSourcePropType
  title: string
  children?: JSX.Element | JSX.Element[]
}

export default function SwiperPanel(props: Props) {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const navigation = useNavigation()

  const [bgOpacity, setBgOpacity] = useState(new Animated.Value(0))

  const pan = useRef(new Animated.ValueXY())

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
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
            goBack()
          } else {
            Animated.spring(pan.current, {toValue: {x: 0, y: 0}}).start()
          }
        },
      }),
    []
  )

  useFocusEffect(() => {
    bgFadeIn()

    return () => {
      bgFadeOut()
    }
  })

  function bgFadeIn() {
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 200,
    }).start()

    setBgOpacity(bgOpacity)
  }

  function bgFadeOut() {
    Animated.timing(bgOpacity, {
      toValue: 0,
      duration: 100,
    }).start()

    setBgOpacity(bgOpacity)
  }

  function goBack() {
    navigation.goBack()
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      <Animated.View
        style={{
          opacity: bgOpacity,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
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
      >
        <TouchableWithoutFeedback onPress={() => goBack()}>
          <View
            style={{
              width: '100%',
              height: '100%',
              minHeight: PANEL_OFFSET,
              flex: 1,
            }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            {transform: pan.current.getTranslateTransform()},
            {
              width: '100%',
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              width: '100%',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              marginBottom: -PANEL_OFFSET,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={[theme.colors.background[0], theme.colors.background[2]]}
              end={[1, 0.75]}
              style={{
                paddingLeft: props.padding,
                paddingRight: props.padding,
                paddingBottom: props.padding,
                paddingTop: 12,
              }}
            >
              <View
                style={{
                  width: 67,
                  height: 4,
                  borderRadius: 2,
                  marginBottom: 36,
                  backgroundColor: theme.colors.background[3],
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flexShrink: 0,
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
                    {props.leftButton}
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
                  <ImageView
                    height={20}
                    width={20}
                    mr="6px"
                    source={props.image}
                  />
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
                    {props.rightButton}
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <ScrollView
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
                  <Fragment>{props.children}</Fragment>
                </TouchableHighlight>
              </ScrollView>
              <View
                style={{
                  height: PANEL_OFFSET,
                }}
              />
            </LinearGradient>
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

SwiperPanel.propTypes = {
  padding: PropTypes.number,
  image: PropTypes.node,
  title: PropTypes.string.isRequired,
}

SwiperPanel.defaultProps = {
  padding: 20,
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
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
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
