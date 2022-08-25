import React from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'

import AccountCard from '../AccountCard'

import { Wallet } from '~/src/models/redux/Wallet'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { LinearLayout } from '~src/styles/styled-components'

type Props = {
  height: number
  width: number
  wallet: Wallet
  outAnimatedValue?: Animated.Value
  inAnimatedValue?: Animated.Value
}

export const WalletAccountsContainer = ({ wallet, inAnimatedValue, outAnimatedValue, height, width }: Props) => {
  const accounts = useSelector(selectAccounts)

  const ordenedWalletAccounts = wallet.getAccounts(accounts).sort(account => (account.blockchain === 'neo3' ? 1 : -1))

  const limitedWalletAccounts = ordenedWalletAccounts.slice(0, 10)

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
