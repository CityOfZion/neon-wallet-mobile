import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, LayoutChangeEvent } from 'react-native'

import { WalletAccountsContainer } from './WalletAccountsContainer'
import { WalletBalanceBar } from './WalletBalanceBar'
import { WalletLabel } from './WalletLabel'
import { WalletOverlay } from './WalletOverlay'

import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import ThemedShadowContainer from '~src/components/themed/ThemedShadowContainer'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Wallet } from '~src/models/redux/Wallet'
import { ButtonView } from '~src/styles/styled-components'

type WithBalanceBarProps = {
  withBalanceBar: true
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

type WithoutBalanceBarProps = {
  withBalanceBar: false
}

type Props = {
  wallet: Wallet
  isInactive?: boolean
  onPress?: () => void
  animationType?: 'in' | 'out'
  width?: number
  height?: number
} & (WithBalanceBarProps | WithoutBalanceBarProps)

export const WalletCard = ({ wallet, isInactive, onPress, animationType = 'out', height, width, ...props }: Props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const outAnimatedFactor = useRef(new Animated.Value(0))
  const inAnimatedFactor = useRef(new Animated.Value(-Dimensions.get('window').height * 0.35))

  const handleLayout = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent.layout.height)
  }

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
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [animationType])

  return (
    <ThemedShadowContainer
      android={{
        width: width ?? 240,
        height: height ?? 365,
        border: 7,
        radius: 30,
        opacity: 0.18,
        y: 7,
        x: 7,
      }}
    >
      <ButtonView
        position="relative"
        width={width ?? 240}
        height={height ?? 365}
        borderRadius="18px"
        bg="background.9"
        activeOpacity={1}
        onPress={handlePress}
        onLayout={handleLayout}
        style={{
          aspectRatio: 25 / 38,
        }}
      >
        <WalletAccountsContainer
          wallet={wallet}
          viewHeight={viewHeight}
          outAnimatedValue={animationType === 'out' ? outAnimatedFactor.current : undefined}
          inAnimatedValue={animationType === 'in' ? inAnimatedFactor.current : undefined}
        />

        <WalletOverlay />

        <WalletLabel wallet={wallet} isInactive={isInactive} />

        {props.withBalanceBar && !isInactive && <WalletBalanceBar balanceExchange={props.balanceExchange} />}
      </ButtonView>
    </ThemedShadowContainer>
  )
}
