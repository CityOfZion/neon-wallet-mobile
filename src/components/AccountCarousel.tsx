import React, { useMemo, useRef } from 'react'

import { Dimensions } from 'react-native'
import type { CarouselRenderItem, TCarouselProps } from 'react-native-reanimated-carousel'
import Carousel from 'react-native-reanimated-carousel'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { getAccountCardDimensions } from './AccountCard/AccountCardNoContent'
import { AccountCard } from './AccountCard'

import type { IAccountState } from '@/types/store'

type TProps = {
  onPress?: (account: IAccountState) => void
  onSelect?: (account: IAccountState) => void
  accounts: IAccountState[]
} & Omit<TCarouselProps, 'data' | 'renderItem' | 'mode'>

type TItem = IAccountState & {
  onPress: (account: IAccountState) => void
}

const accountCardDimensions = getAccountCardDimensions(Dimensions.get('window').width * 0.7)

const renderItem: CarouselRenderItem<TItem> = ({ item }) => {
  return (
    <AccountCard
      account={item}
      width={accountCardDimensions.width}
      hideBalance={false}
      onPress={() => item.onPress(item)}
      hideCopy
      hideQRCode
      style={{
        transformOrigin: 'top left',
      }}
    />
  )
}

export const AccountCarousel = ({ accounts, onPress, onSelect, ...props }: TProps) => {
  const isSnapping = useRef(false)
  const selectedIndex = useRef(0)

  const data = useMemo<TItem[]>(() => {
    return accounts.map(account => ({
      ...account,
      onPress: account => {
        if (isSnapping.current) return
        onPress?.(account)
      },
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts])

  const handleSelect = async (index: number) => {
    selectedIndex.current = index
    if (onSelect) onSelect(accounts[index])
  }

  const handleScrollStart = () => {
    isSnapping.current = true
  }

  const handleScrollEnd = async () => {
    await UtilsHelper.sleep(100)
    isSnapping.current = false
  }

  return (
    <Carousel
      data={data}
      width={accountCardDimensions.width}
      height={accountCardDimensions.height}
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      autoFillData={false}
      vertical={false}
      mode="parallax"
      loop={false}
      defaultIndex={0}
      modeConfig={{
        parallaxScrollingScale: 1,
        parallaxScrollingOffset: 0,
        parallaxAdjacentItemScale: 0.85,
      }}
      windowSize={3}
      onScrollStart={handleScrollStart}
      onScrollEnd={handleScrollEnd}
      onSnapToItem={handleSelect}
      renderItem={renderItem}
      {...(props as any)}
    />
  )
}
