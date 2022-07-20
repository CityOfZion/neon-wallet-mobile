import React, { useRef, useState } from 'react'
import { LayoutChangeEvent, Animated, Easing } from 'react-native'

import { Normalize } from '../app/Normalize'
import { BalanceHelper } from '../helpers/BalanceHelper'
import { Account } from '../models/redux/Account'
import { LinearLayout } from '../styles/styled-components'
import { Balance } from '../types/balance'
import { Exchange } from '../types/exchange'
import AccountCard from './AccountCard'

interface Props {
  accounts: Account[]
  onPress: (account: Account) => void
  disableSecondTouch?: boolean
  exchange?: Exchange
  balances?: Balance[]
}
interface ItemProps {
  exchange?: Exchange
  balance?: Balance
  account: Account
  isStackMode: boolean
  onPress(): void
  disableSecondTouch?: boolean
}

const Item = React.memo(({ balance, exchange, account, disableSecondTouch, isStackMode, onPress }: ItemProps) => {
  return (
    <LinearLayout>
      <AccountCard
        balance={balance}
        exchange={exchange}
        account={account}
        isStackMode={isStackMode}
        isCompacted
        onPress={onPress}
        disableSecondTouch={disableSecondTouch}
      />
    </LinearLayout>
  )
})

export const AccountCards = (props: Props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const posYFactor = useRef(new Animated.Value(0))

  const layoutEvent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setViewHeight(height)

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(val => val ** 2),
    }).start()
  }

  return (
    <Animated.View onLayout={layoutEvent} style={{ opacity: posYFactor.current }}>
      {props.accounts.map((account, index) => (
        <Animated.View
          key={index}
          style={[
            {
              transform: [
                {
                  translateY: posYFactor.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-viewHeight * (1 + 0.1 * index), 0],
                  }),
                },
              ],
            },
            {
              zIndex: index,
              marginTop: index !== 0 ? Normalize.scale(-130) : undefined,
            },
          ]}
        >
          <Item
            account={account}
            balance={BalanceHelper.getBalanceByAccount(account, props.balances)}
            exchange={props.exchange}
            disableSecondTouch={props.disableSecondTouch}
            isStackMode={index !== props.accounts.length - 1}
            onPress={() => props.onPress(account)}
          />
        </Animated.View>
      ))}
    </Animated.View>
  )
}
