import React, { forwardRef, Fragment, memo, Suspense, useImperativeHandle, useMemo, useRef } from 'react'

import type { PressableProps, ViewStyle } from 'react-native'
import { Dimensions, Pressable, View } from 'react-native'
import type { AnimationCallback } from 'react-native-reanimated'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'

import WalletFront from '@/assets/images/wallet-front.svg'

import { AccountCard } from '../AccountCard'
import type { TAccountCardNoContentProps } from '../AccountCard/AccountCardNoContent'
import { AccountCardNoContent } from '../AccountCard/AccountCardNoContent'
import { WalletCardLabel } from './WalletCardLabel'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { IWalletState } from '@/types/store'

const WalletCardBalanceBar = React.lazy(() =>
  import('./WalletCardBalanceBar').then(module => ({ default: module.WalletCardBalanceBar }))
)

export type TWalletCardRef = {
  runInAnimation: (callback?: AnimationCallback) => void
  runOutAnimation: (callback?: AnimationCallback) => void
  resetAnimation: () => void
}

type TProps = {
  wallet: IWalletState
  isInactive?: boolean
  onPress?: (wallet: IWalletState, ref: TWalletCardRef) => void | Promise<void>
  withBalanceBar?: boolean
  width?: number
  blockchains?: TBlockchainServiceKey[]
  style?: ViewStyle
} & Omit<PressableProps, 'children' | 'onPress' | 'style'>

export const WALLET_CARD_WIDTH = 282
export const WALLET_CARD_HEIGHT = 385
export const WALLET_CARD_HEIGHT_RATIO = WALLET_CARD_HEIGHT / WALLET_CARD_WIDTH

export const getWalletCardDimensions = (width?: number) => {
  let newWidth = width ? width : WALLET_CARD_WIDTH
  newWidth = Math.min(newWidth, Dimensions.get('window').width * 0.9)

  const newHeight = newWidth * WALLET_CARD_HEIGHT_RATIO

  return {
    width: newWidth,
    height: newHeight,
  }
}

const WalletCardComponent = forwardRef<TWalletCardRef, TProps>(
  ({ wallet, isInactive, withBalanceBar = false, width, blockchains, onPress, style, ...props }, ref) => {
    const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

    const filteredAccounts = useMemo(() => {
      let accounts = accountsByWalletId

      if (blockchains) {
        accounts = accounts.filter(account => blockchains.includes(account.blockchain))
      }

      return accounts.slice(0, 5)
    }, [accountsByWalletId, blockchains])

    const isAnimating = useRef(false)

    const animatedValue = useSharedValue(0)

    const animatedStyled = useAnimatedStyle(() => ({
      transform: [
        { translateY: interpolate(animatedValue.value, [0, 1], [0, -WALLET_CARD_HEIGHT]) },
        { rotate: '90deg' },
      ],
      opacity: interpolate(animatedValue.value, [0, 1], [1, 0]),
      overflow: animatedValue.value <= 0.5 ? 'hidden' : 'visible',
    }))

    const walletCardDimensions = getWalletCardDimensions(width)

    const scaleX = walletCardDimensions.width / WALLET_CARD_WIDTH
    const scaleY = walletCardDimensions.height / WALLET_CARD_HEIGHT

    const runInAnimation = (callback?: AnimationCallback) => {
      if (isAnimating.current) return

      isAnimating.current = true
      animatedValue.value = 1
      animatedValue.value = withTiming(0, { duration: 500 }, (...params) => {
        if (callback) {
          scheduleOnRN(callback, ...params)
        }
      })
    }

    const runOutAnimation = (callback?: AnimationCallback) => {
      if (isAnimating.current) return

      isAnimating.current = true
      animatedValue.value = 0
      animatedValue.value = withTiming(1, { duration: 500 }, (...params) => {
        if (callback) {
          scheduleOnRN(callback, ...params)
        }
      })
    }

    const resetAnimation = () => {
      animatedValue.value = withTiming(0, { duration: 10 })
      isAnimating.current = false
    }

    const handlePress = () => {
      if (!onPress || isInactive) return

      onPress(wallet, { runOutAnimation, runInAnimation, resetAnimation })
    }

    useImperativeHandle(
      ref,
      () => ({
        runInAnimation,
        runOutAnimation,
        resetAnimation,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    return (
      <Pressable
        onPress={handlePress}
        style={{
          ...style,
          width: walletCardDimensions.width,
          height: walletCardDimensions.height,
        }}
        {...props}
      >
        <View
          style={{
            width: WALLET_CARD_WIDTH,
            height: WALLET_CARD_HEIGHT,
            transform: [{ scaleX }, { scaleY }],
            transformOrigin: 'top left',
          }}
        >
          <View
            className="relative h-full w-full items-center justify-center rounded-3xl bg-gray-750"
            style={{
              boxShadow:
                '-1px -1px 6px 0px #00000066 inset, 1px 1px 2px 0px #D6D2D266 inset, 13px 13px 40px 0px #111316E0',
            }}
          >
            <Animated.View
              className="relative bottom-1 justify-center"
              style={[animatedStyled, { width: WALLET_CARD_HEIGHT * 0.9, height: WALLET_CARD_WIDTH }]}
            >
              {filteredAccounts.map((account, index) => {
                const props: TAccountCardNoContentProps = {
                  account,
                  height: 245,
                  withShadow: false,
                  style: { position: 'absolute', left: index * 10, transformOrigin: undefined },
                }

                return (
                  <Fragment key={account.id}>
                    {index === filteredAccounts.length - 1 ? (
                      <AccountCard hideBalance hideCopy hideQRCode isCompacted {...props} />
                    ) : (
                      <AccountCardNoContent {...props} />
                    )}
                  </Fragment>
                )
              })}
            </Animated.View>

            <WalletFront className="absolute -bottom-2 -left-1" />

            <WalletCardLabel wallet={wallet} isInactive={isInactive} />

            {withBalanceBar && !isInactive && (
              <Suspense fallback={null}>
                <WalletCardBalanceBar accounts={filteredAccounts} />
              </Suspense>
            )}
          </View>
        </View>
      </Pressable>
    )
  }
)

export const WalletCard = memo(WalletCardComponent)
