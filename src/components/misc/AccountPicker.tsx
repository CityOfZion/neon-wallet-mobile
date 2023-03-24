import React, { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import AccountCard from '~src/components/AccountCard'
import { Account } from '~src/models/redux/Account'
import { LinearLayout } from '~src/styles/styled-components'

interface Props {
  onPress?: (account: Account) => void
  onSelect?: (account: Account) => void
  accounts: Account[]
  balancesExchange: UseMultipleBalanceAndExchangeResult
}

const AccountPicker: React.FC<Props> = ({ accounts, onPress, onSelect, balancesExchange }: Props) => {
  const [width, setWidth] = useState<number>()

  const bgOpacity = useRef(new Animated.Value(0))

  const handlePress = async (account: Account) => {
    if (onPress) onPress(account)
  }

  const handleSelect = async (index: number) => {
    if (onSelect) onSelect(accounts[index])
  }

  const getAccountBalanceExchange = (account: Account) => {
    if (!account.address) return

    return balancesExchange.findByBalanceKey(account.address)
  }

  useEffect(() => {
    if (!width) return

    Animated.timing(bgOpacity.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [width])

  return (
    <LinearLayout width="100%" onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View
        style={{
          opacity: bgOpacity.current,
        }}
      >
        <Carousel<Account>
          layout="default"
          data={accounts}
          sliderWidth={width ?? applicationConfig.windowWidth}
          itemWidth={240}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={1}
          inactiveSlideShift={12}
          lockScrollWhileSnapping
          lockScrollTimeoutDuration={200}
          activeSlideOffset={5}
          swipeThreshold={5}
          enableSnap
          useScrollView
          onSnapToItem={handleSelect}
          renderItem={({ item }) => (
            <AccountCard
              balanceExchange={getAccountBalanceExchange(item)}
              hideBalance={false}
              onPress={() => handlePress(item)}
              account={item}
              hideCopy
              hideQRCode
              width={240}
            />
          )}
        />
      </Animated.View>
    </LinearLayout>
  )
}

export default AccountPicker
