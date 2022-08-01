import React, { useMemo } from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'

import AccountCard from '../AccountCard'

import { Wallet } from '~/src/models/redux/Wallet'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout } from '~src/styles/styled-components'

type Props = {
  height: number
  width: number
  wallet: Wallet
  outAnimatedValue?: Animated.Value
  inAnimatedValue?: Animated.Value
}

export const WalletAccountsContainer = ({ wallet, inAnimatedValue, outAnimatedValue, height, width }: Props) => {
  const accounts = useSelector((state: RootState) => state.app.accounts)

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
      <Animated.View
        style={
          outAnimatedValue
            ? {
                transform: [
                  {
                    translateX: outAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -height * 1.8],
                    }),
                  },
                ],
              }
            : undefined
        }
      >
        <Animated.View
          style={
            inAnimatedValue
              ? {
                  transform: [
                    {
                      translateX: inAnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                }
              : undefined
          }
        >
          {limitedWalletAccounts.map((account, index) => (
            <LinearLayout position="absolute" left={`${index * 4}px`}>
              <AccountCard width={width} height={height} account={account} hideBalance />
            </LinearLayout>
          ))}
        </Animated.View>
      </Animated.View>
    </LinearLayout>
  )
}
