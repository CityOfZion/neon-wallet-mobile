import React, { useMemo, useRef } from 'react'

import type { CarouselRenderItem, TCarouselProps } from 'react-native-reanimated-carousel'
import Carousel from 'react-native-reanimated-carousel'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import type { TWalletCardRef } from './WalletCard'
import { getWalletCardDimensions, WalletCard } from './WalletCard'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { IWalletState } from '@/types/store'

interface TProps {
  onPress?: (wallet: IWalletState, ref: TWalletCardRef) => void
  onSelect?: (wallet: IWalletState) => void
  onScrollBegin?: TCarouselProps['onScrollStart']
  onScrollEnd?: (index: number) => void
  selectedWallet?: IWalletState
  wallets: IWalletState[]
  blockchains?: TBlockchainServiceKey[]
}

type TItem = IWalletState & {
  isSelected: () => boolean
  blockchains?: TBlockchainServiceKey[]
  onPress: (wallet: IWalletState, ref: TWalletCardRef) => void
}

const walletCardDimensions = getWalletCardDimensions()

const renderItem: CarouselRenderItem<TItem> = ({ item }) => {
  return (
    <WalletCard
      width={walletCardDimensions.width}
      withBalanceBar={item.isSelected()}
      onPress={item.onPress}
      wallet={item}
      blockchains={item.blockchains}
    />
  )
}

export const WalletCarousel = ({
  selectedWallet,
  onPress,
  blockchains,
  onScrollBegin,
  onScrollEnd,
  onSelect,
  wallets,
}: TProps) => {
  const isSnapping = useRef(false)

  const selectedWalletRef = useRef<IWalletState>(undefined)
  selectedWalletRef.current = selectedWallet

  const data = useMemo<TItem[]>(() => {
    return wallets.map(wallet => ({
      ...wallet,
      isSelected: () => selectedWalletRef.current?.id === wallet.id,
      blockchains,
      onPress: (wallet, ref) => {
        if (isSnapping.current || (selectedWalletRef.current && wallet.id !== selectedWalletRef.current.id)) return

        if (onPress) onPress(wallet, ref)
      },
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchains, wallets])

  const selectedWalletDefaultIndexRef = useRef(
    selectedWallet
      ? Math.max(
          0,
          wallets.findIndex(({ id }) => id === selectedWallet.id)
        )
      : 0
  )

  const handleSelect = (index: number) => {
    if (onSelect) onSelect(wallets[index])
  }

  const handleScrollStart = () => {
    isSnapping.current = true
    onScrollBegin?.()
  }

  const handleScrollEnd = async (index: number) => {
    if (onScrollEnd) onScrollEnd(index)

    await UtilsHelper.sleep(100)

    isSnapping.current = false
  }

  return (
    <Carousel
      data={data}
      loop={false}
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      width={walletCardDimensions.width}
      height={walletCardDimensions.height}
      windowSize={3}
      mode="parallax"
      defaultIndex={selectedWalletDefaultIndexRef.current}
      modeConfig={{
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: 0,
        parallaxAdjacentItemScale: 0.85,
      }}
      onSnapToItem={handleSelect}
      onScrollStart={handleScrollStart}
      onScrollEnd={handleScrollEnd}
      snapEnabled
      renderItem={renderItem}
    />
  )
}
