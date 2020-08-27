import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Animated, LayoutChangeEvent, PanResponder} from 'react-native'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import {Account} from '~src/models/redux/Account'
import {LinearLayout, RelativeLayout} from '~src/styles/styled-components'

interface Props {
  onSelect?: (account: Account) => void
  onSelectionStart?: () => void
  onSelectionEnd?: () => void
  accounts: Account[]
}

const AccountPicker: React.FC<Props> = (props: Props) => {
  const {accounts} = props

  const [viewHeight, setViewHeight] = useState<number>(0)

  const pickerRatio = 38 / 25
  const depthYRelativeRatio = 1
  const depthYAbsoluteRatio = 10
  const depthXRelativeRatio = 1.15
  const depthXAbsoluteRatio = 10

  const defaultInitialSelectionTopScale = 1
  const defaultSelectionTopScale = 0.9
  const defaultReleaseSelectionTopScale = 0.75

  const defaultInitialSelectionNonTopScale = 1
  const defaultReleaseSelectionNonTopScale = 1.06
  const defaultInitialSelectionNonTopTranslateY = 0
  const defaultReleaseSelectionNonTopTranslateY = viewHeight * 0.065

  const defaultTopIndex = 100
  const defaultMiddleIndex = 50
  const defaultBottomIndex = 0

  const triggerDistance = viewHeight
  const triggerDistanceOffset = viewHeight * 0.1
  const maxDraggableDistance = viewHeight * 1.25

  const topIndex = new Animated.Value(defaultTopIndex)
  const topScale = new Animated.Value(defaultInitialSelectionTopScale)
  const nonTopScale = new Animated.Value(defaultInitialSelectionNonTopScale)
  const nonTopTranslateY = new Animated.Value(
    defaultInitialSelectionNonTopTranslateY
  )
  const pan = new Animated.ValueXY()

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (e, gestureState) => {
      if (Math.abs(gestureState.dy + triggerDistanceOffset) > triggerDistance) {
        animateToReleaseSelection().start()
      } else {
        animateToSelection().start(() => {
          if (props.onSelectionStart) {
            props.onSelectionStart()
          }
        })
      }

      if (Math.abs(gestureState.dy) <= maxDraggableDistance) {
        return Animated.event([null, {dy: pan.y}], {
          useNativeDriver: false,
        })(e, gestureState)
      }

      return null
    },

    onPanResponderRelease: (e, {dy}) => {
      const trigger = Math.abs(dy + triggerDistanceOffset) > triggerDistance

      const animatedEvents = [
        Animated.spring(pan.y, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: false,
        }),
      ]

      if (!trigger) {
        animatedEvents.push(animateToInitialSelection())
      }

      Animated.parallel(animatedEvents).start(() => {
        if (props.onSelectionEnd) {
          props.onSelectionEnd()
        }

        if (trigger) {
          animateToInitialSelection()
          selectEvent()
        }
      })
    },
  })

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  const selectEvent = async () => {
    const firstAccount = accounts[0]

    accounts.shift()
    accounts.push(firstAccount)

    if (props.onSelect) {
      props.onSelect(Facade.lodash.cloneDeep(accounts[0]))
    }
  }

  const zIndex = (i: number) => {
    return accounts.length - i + defaultMiddleIndex
  }

  const animateToInitialSelection = () => {
    return Animated.parallel([
      Animated.timing(topIndex, {
        toValue: defaultTopIndex,
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.spring(topScale, {
        toValue: defaultInitialSelectionTopScale,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopScale, {
        toValue: defaultInitialSelectionNonTopScale,
        speed: 500,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopTranslateY, {
        toValue: defaultInitialSelectionNonTopTranslateY,
        speed: 500,
        useNativeDriver: false,
      }),
    ])
  }

  const animateToSelection = () => {
    return Animated.parallel([
      Animated.timing(topIndex, {
        toValue: defaultTopIndex,
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.spring(topScale, {
        toValue: defaultSelectionTopScale,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopScale, {
        toValue: defaultInitialSelectionNonTopScale,
        speed: 500,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopTranslateY, {
        toValue: defaultInitialSelectionNonTopTranslateY,
        speed: 500,
        useNativeDriver: false,
      }),
    ])
  }

  const animateToReleaseSelection = () => {
    return Animated.parallel([
      Animated.timing(topIndex, {
        toValue: defaultBottomIndex,
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.spring(topScale, {
        toValue: defaultReleaseSelectionTopScale,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopScale, {
        toValue: defaultReleaseSelectionNonTopScale,
        speed: 500,
        useNativeDriver: false,
      }),
      Animated.spring(nonTopTranslateY, {
        toValue: defaultReleaseSelectionNonTopTranslateY,
        speed: 500,
        useNativeDriver: false,
      }),
    ])
  }

  const _renderAccountCard = (account: Account) => {
    return (
      <RelativeLayout height={viewHeight} pointerEvents={'none'}>
        <AccountCard account={account} isCompacted={true} />
      </RelativeLayout>
    )
  }

  return (
    <LinearLayout
      mt={5}
      onLayout={layoutEvent}
      width={'100%'}
      style={{
        aspectRatio: pickerRatio,
      }}
    >
      {accounts.slice(0, 3).map((account, i) => {
        if (i === 0) {
          return (
            <Animated.View
              {...panResponder.panHandlers}
              key={account.address ?? i}
              style={[
                {
                  transform: [
                    ...pan.getTranslateTransform(),
                    {scaleX: topScale},
                    {scaleY: topScale},
                  ],
                  zIndex: topIndex,
                },
              ]}
            >
              {_renderAccountCard(account)}
            </Animated.View>
          )
        }

        return (
          <Animated.View
            key={account.address ?? i}
            style={[
              {
                transform: [
                  {scaleX: nonTopScale},
                  {scaleY: nonTopScale},
                  {translateY: nonTopTranslateY},
                ],
                position: 'absolute',
                top: -Facade.scale(
                  i ** depthYRelativeRatio * depthYAbsoluteRatio
                ),
                left: Facade.scale(
                  i ** depthXRelativeRatio * depthXAbsoluteRatio
                ),
                right: Facade.scale(
                  i ** depthXRelativeRatio * depthXAbsoluteRatio
                ),
                zIndex: zIndex(i),
              },
            ]}
          >
            {_renderAccountCard(account)}
          </Animated.View>
        )
      })}
    </LinearLayout>
  )
}

AccountPicker.propTypes = {
  onSelect: PropTypes.func,
  onSelectionStart: PropTypes.func,
  onSelectionEnd: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(Account).isRequired)
    .isRequired,
}

export default AccountPicker
