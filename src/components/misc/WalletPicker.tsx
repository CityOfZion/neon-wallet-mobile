import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Animated } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import { LinearLayout } from '~/src/styles/styled-components'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import { WalletCard, walletCardWidth } from '~src/components/WalletCard/WalletCard'
import { Wallet } from '~src/models/redux/Wallet'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  selectedWallet: Wallet
  wallets: Wallet[]
  selectedWalletBalanceExchange: UseMultipleBalanceAndExchangeResult
  isInactive?: boolean
  pressedWallet?: Wallet
  inactiveNotSelected?: boolean
  onScrollBegin?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollEnd?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEnabled?: boolean
}

const WalletPicker = ({
  selectedWallet,
  selectedWalletBalanceExchange,
  isInactive,
  onPress,
  onScrollBegin,
  onScrollEnd,
  onSelect,
  wallets,
  inactiveNotSelected,
  scrollEnabled,
  pressedWallet,
}: Props) => {
  const [width, setWidth] = useState<number>()

  const bgOpacity = useRef(new Animated.Value(0))

  const selectWalletIndex = useMemo(
    () => wallets.findIndex(it => it.id === selectedWallet.id) ?? 0,
    [wallets, selectedWallet]
  )

  const handlePress = async (wallet: Wallet) => {
    if (onPress) onPress(wallet)
  }

  const handleSelect = (index: number) => {
    if (onSelect) onSelect(wallets[index])
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
        <Carousel<Wallet>
          data={wallets}
          sliderWidth={width ?? applicationConfig.windowWidth}
          itemWidth={walletCardWidth}
          enableSnap
          inactiveSlideScale={0.85}
          inactiveSlideOpacity={1}
          lockScrollWhileSnapping
          enableMomentum
          lockScrollTimeoutDuration={200}
          activeSlideOffset={5}
          swipeThreshold={5}
          useScrollView
          onSnapToItem={handleSelect}
          onScrollBeginDrag={onScrollBegin}
          onScrollEndDrag={onScrollEnd}
          renderItem={({ item, index }) => (
            <WalletCard
              balanceExchange={selectedWalletBalanceExchange}
              withBalanceBar={index === selectWalletIndex}
              onPress={() => handlePress(item)}
              wallet={item}
              isInactive={index === selectWalletIndex ? isInactive : inactiveNotSelected ? true : undefined}
              wasPressed={pressedWallet?.id === item.id}
              disablePointer={index !== selectWalletIndex}
            />
          )}
        />
      </Animated.View>
    </LinearLayout>
  )
}

export default WalletPicker
