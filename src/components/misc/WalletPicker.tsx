import React, { useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
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

  return (
    <Carousel<Wallet>
      data={wallets}
      sliderWidth={applicationConfig.windowWidth}
      itemWidth={walletCardWidth}
      inactiveSlideScale={0.8}
      inactiveSlideOpacity={1}
      inactiveSlideShift={12}
      lockScrollWhileSnapping
      lockScrollTimeoutDuration={200}
      activeSlideOffset={5}
      swipeThreshold={5}
      useScrollView
      firstItem={selectWalletIndex}
      onSnapToItem={handleSelect}
      onScrollBeginDrag={onScrollBegin}
      onScrollEndDrag={onScrollEnd}
      scrollEnabled={scrollEnabled}
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
  )
}

export default WalletPicker
