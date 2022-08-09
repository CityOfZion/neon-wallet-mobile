import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import { WalletAccountsContainer } from './WalletAccountsContainer'
import { WalletBalanceBar } from './WalletBalanceBar'
import { WalletLabel } from './WalletLabel'
import { WalletOverlay } from './WalletOverlay'

import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import { LinearLayoutProps } from '~/src/types/styled-components'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Wallet } from '~src/models/redux/Wallet'
import { ButtonView, LinearLayout } from '~src/styles/styled-components'

type WithBalanceBarProps = {
  withBalanceBar: true
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

type WithoutBalanceBarProps = {
  withBalanceBar: false
}

export type TANimationType = 'in' | 'out'

type Props = {
  wallet: Wallet
  isInactive?: boolean
  onPress?: () => void
  animationType?: TANimationType
  width?: number
  height?: number
  containerStyle?: LinearLayoutProps
} & (WithBalanceBarProps | WithoutBalanceBarProps)

export const WalletCard = ({
  wallet,
  isInactive,
  onPress,
  animationType = 'out',
  height,
  width,
  containerStyle,
  ...props
}: Props) => {
  const viewWidth = width ?? 280
  const viewHeight = height ?? 386

  const outAnimatedFactor = useRef(new Animated.Value(0))
  const inAnimatedFactor = useRef(new Animated.Value(0))

  const handlePress = () => {
    if (!onPress || isInactive) return

    if (animationType !== 'out') {
      onPress()
      return
    }

    Animated.timing(outAnimatedFactor.current, {
      toValue: 1,
      duration: 500,
      easing: Easing.in(val => val ** 2),
      useNativeDriver: true,
    }).start(async () => {
      onPress()
      await UtilsHelper.sleep(500)
      outAnimatedFactor.current.setValue(0)
    })
  }

  useEffect(() => {
    if (animationType !== 'in') return

    Animated.timing(inAnimatedFactor.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [animationType])

  return (
    <Shadow radius={18} offset={[4, 4]}>
      <LinearLayout overflow="hidden" {...containerStyle}>
        <ButtonView
          width={viewWidth}
          height={viewHeight}
          borderRadius="18px"
          bg="background.9"
          activeOpacity={1}
          onPress={handlePress}
        >
          <WalletAccountsContainer
            wallet={wallet}
            width={viewHeight * 0.95}
            height={viewWidth * 0.95}
            outAnimatedValue={animationType === 'out' ? outAnimatedFactor.current : undefined}
            inAnimatedValue={animationType === 'in' ? inAnimatedFactor.current : undefined}
          />

          <WalletOverlay width={viewWidth} height={viewHeight} />

          <WalletLabel width={viewWidth} height={viewHeight} wallet={wallet} isInactive={isInactive} />

          {props.withBalanceBar && !isInactive && <WalletBalanceBar balanceExchange={props.balanceExchange} />}
        </ButtonView>
      </LinearLayout>
    </Shadow>
  )
}
