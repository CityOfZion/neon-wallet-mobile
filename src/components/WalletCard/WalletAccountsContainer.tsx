import React, { useMemo } from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'

import AccountCard from '../AccountCard'

import { Wallet } from '~/src/models/redux/Wallet'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { LinearLayout, RelativeLayout } from '~src/styles/styled-components'

type Props = {
  height: number
  width: number
  wallet: Wallet
  outAnimatedValue?: Animated.Value
  inAnimatedValue?: Animated.Value
}

type WalletAccountProps = {
  viewHeight: number
  account: Account
  index: number
}

const WalletAccount = ({ account, index, viewHeight }: WalletAccountProps) => {
  const ratio = 38 / 25
  const cardWidth = viewHeight - 12
  const cardHeight = cardWidth / ratio

  return (
    <LinearLayout
      mt={`${index * 4}px`}
      position="absolute"
      style={{
        top: 3 + cardHeight * ratio * 0.5,
        left: 5 + cardHeight * 0.5,
      }}
    >
      <RelativeLayout
        width={cardWidth}
        style={{
          top: -cardHeight * 0.5,
          left: -(cardHeight * ratio) * 0.5,
          transform: [{ rotate: '90deg' }],
        }}
      >
        <AccountCard account={account} hideBalance />
      </RelativeLayout>
    </LinearLayout>
  )
}

export const WalletAccountsContainer = ({ wallet, inAnimatedValue, outAnimatedValue, viewHeight }: Props) => {
  const accounts = useSelector(selectAccounts)

  const limitedWalletAccounts = useMemo(() => wallet.getAccounts(accounts).slice(0, 10), [wallet, accounts])

  return (
    <LinearLayout
      position="absolute"
      width={width}
      height={height}
      top="50%"
      left="50%"
      style={{ transform: [{ translateX: -width / 2 }, { translateY: -height / 2 }, { rotate: '90deg' }] }}
    >
      <LinearLayout position="relative" left="-4px">
        <Animated.View
          style={{
            transform: [
              {
                translateX: outAnimatedValue
                  ? outAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -height * 1.8],
                    })
                  : inAnimatedValue
                  ? inAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-height * 1.8, 0],
                    })
                  : 0,
              },
            ],
          }}
        >
          {limitedWalletAccounts.map((account, index) => (
            <LinearLayout position="absolute" left={`${index * 4}px`}>
              <AccountCard width={width} height={height} account={account} hideBalance />
            </LinearLayout>
          ))}
        </Animated.View>
      </LinearLayout>
    </LinearLayout>
  )
}
