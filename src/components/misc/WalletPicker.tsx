import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import { LinearLayout } from '~/src/styles/styled-components'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import { WalletCard, walletCardHeight, walletCardWidth } from '~src/components/WalletCard/WalletCard'
import { Wallet } from '~src/models/redux/Wallet'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  selectedWallet?: Wallet
  wallets: Wallet[]
  selectedWalletBalanceExchange: UseMultipleBalanceAndExchangeResult
  isInactive?: boolean
  pressedWallet?: Wallet
  inactiveNotSelected?: boolean
  onScrollBegin?: () => void
  onScrollEnd?: () => void
  scrollEnabled?: boolean
  defaultIndex?: number
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
  defaultIndex,
}: Props) => {
  const [width, setWidth] = useState<number>()

  const bgOpacity = useRef(new Animated.Value(0))

  const selectWalletIndex = useMemo(
    () => (selectedWallet ? wallets.findIndex(it => it.id === selectedWallet.id) ?? 0 : 0),
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
        <Carousel
          data={wallets}
          loop={false}
          style={{
            width: width ?? applicationConfig.windowWidth,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          width={walletCardWidth}
          height={walletCardHeight}
          autoFillData={false}
          vertical={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 0,
            parallaxAdjacentItemScale: 0.85,
          }}
          onSnapToItem={handleSelect}
          onScrollBegin={onScrollBegin}
          onScrollEnd={onScrollEnd}
          enabled={scrollEnabled}
          defaultIndex={defaultIndex ?? 0}
          snapEnabled
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
