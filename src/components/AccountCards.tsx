import React, {useRef, useState} from 'react'
import {LayoutChangeEvent, Animated, Easing} from 'react-native'

import {Normalize} from '../app/Normalize'
import {Account} from '../models/redux/Account'
import {LinearLayout} from '../styles/styled-components'
import AccountCard from './AccountCard'

export const AccountCards = (props: {
  accounts: Account[]
  onPress: (account: Account) => void
  disableSecondTouch?: boolean
}) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const posYFactor = useRef(new Animated.Value(0))

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out((val) => val ** 2),
    }).start()
  }

  return (
    <Animated.View onLayout={layoutEvent} style={{opacity: posYFactor.current}}>
      {props.accounts.map((account: Account, i: number) => {
        const marginTop = i !== 0 ? Normalize.scale(-130) : undefined
        return (
          <Animated.View
            key={i}
            style={[
              {
                transform: [
                  {
                    translateY: posYFactor.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-viewHeight * (1 + 0.1 * i), 0],
                    }),
                  },
                ],
              },
              {
                zIndex: i,
                marginTop,
              },
            ]}
          >
            <LinearLayout>
              <AccountCard
                account={account}
                isCompacted={true}
                isStackMode={i !== props.accounts.length - 1}
                onPress={() => props.onPress(account)}
                disableSecondTouch={props.disableSecondTouch}
              />
            </LinearLayout>
          </Animated.View>
        )
      })}
    </Animated.View>
  )
}
