import React, { useRef, useState } from 'react'
import { LayoutChangeEvent, Animated, Easing } from 'react-native'

import { Normalize } from '../app/Normalize'
import { Account } from '../models/redux/Account'
import { UseMultipleBalanceAndExchangeResult } from '../types/query'
import AccountCard from './AccountCard'

interface Props {
  accounts: Account[]
  onPress: (account: Account) => void
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

export const AccountCards = ({ accounts, balanceExchange, onPress }: Props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const posYFactor = useRef(new Animated.Value(0))

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setViewHeight(height)

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(val => val ** 2),
    }).start()
  }

  const getBalanceExchange = (account: Account) => {
    if (!account.address) return

    return balanceExchange.findByBalanceKey(account.address)
  }

  return (
    <Animated.View onLayout={handleLayout} style={{ opacity: posYFactor.current }}>
      {accounts.map((account, index) => (
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
          <AccountCard
            hideBalance={false}
            balanceExchange={getBalanceExchange(account)}
            account={account}
            isCompacted
            onPress={() => onPress(account)}
          />
        </Animated.View>
      ))}
    </Animated.View>
  )
}
