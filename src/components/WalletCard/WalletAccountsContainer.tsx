import React, { useMemo } from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'

import AccountCard from '../AccountCard'

import { Account } from '~/src/models/redux/Account'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, RelativeLayout } from '~src/styles/styled-components'

type Props = {
  viewHeight: number
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
  const accounts = useSelector((state: RootState) => state.app.accounts)

  const limitedWalletAccounts = useMemo(() => wallet.getAccounts(accounts).slice(0, 10), [wallet, accounts])

  return (
    <LinearLayout
      position="absolute"
      bottom={0}
      width="100%"
      height={3 * viewHeight}
      overflow="hidden"
      borderRadius="18px"
    >
      <RelativeLayout top={2 * viewHeight}>
        {limitedWalletAccounts.map((account, index) => (
          <Animated.View
            key={index}
            style={
              outAnimatedValue
                ? {
                    transform: [
                      {
                        translateY: outAnimatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -viewHeight * (1.2 + 0.1 * (limitedWalletAccounts.length - index))],
                        }),
                      },
                    ],
                  }
                : undefined
            }
          >
            <Animated.View
              key={index}
              style={
                inAnimatedValue
                  ? {
                      transform: [
                        {
                          translateY: inAnimatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    }
                  : undefined
              }
            >
              <WalletAccount viewHeight={viewHeight} account={account} index={index} />
            </Animated.View>
          </Animated.View>
        ))}
      </RelativeLayout>
    </LinearLayout>
  )
}
