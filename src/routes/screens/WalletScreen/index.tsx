import React, { Fragment, useEffect, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import type { LayoutChangeEvent } from 'react-native'
import { Text } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { getAccountCardDimensions } from '@/components/AccountCard/AccountCardNoContent'
import { AccountCardStackList } from '@/components/AccountCardStackList'
import { Loader } from '@/components/Loader'
import { PressableScale } from '@/components/PressableScale'
import { RefreshControl } from '@/components/RefreshControl'
import { TwIconButton } from '@/components/TwIconButton'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useAccountsByWalletIdSelector, useHasHardwareAccountSelector } from '@/hooks/useAccountSelector'
import { useHardwareWalletAddAccount } from '@/hooks/useHardwareWallet'
import { useLoadingActions } from '@/hooks/useLoadingActions'
import { useRefetch } from '@/hooks/useQuery'
import { useAppDispatch } from '@/hooks/useRedux'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdAdd from '@/assets/images/md-add.svg'
import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

const accountCardDimensions = getAccountCardDimensions()

export const WalletScreen = ({ navigation, route }: TWalletsStackScreenProps<'WalletScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'wallet' })
  const dispatch = useAppDispatch()

  const { wallet } = useWalletByIdSelector(route.params.wallet.id)
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)
  const { hasHardwareAccount } = useHasHardwareAccountSelector()
  const { addHardwareAccount } = useHardwareWalletAddAccount()

  const { isRefetching, refetch } = useRefetch()

  const alreadyAnimated = useRef(false)

  const translateYValue = useSharedValue(0)
  const opacityValue = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => ({
    translateY: translateYValue.value,
    opacity: opacityValue.value,
  }))

  const createNewAccountAction = useLoadingActions(async () => {
    if (wallet.type === 'hardware') {
      await addHardwareAccount(wallet)
    } else {
      navigation.navigate('CreateAccountBlockchainSelectionModal', {
        wallet,
      })
    }
  })

  const handleLayout = (event: LayoutChangeEvent) => {
    if (alreadyAnimated.current) return

    alreadyAnimated.current = true

    const { height } = event.nativeEvent.layout

    translateYValue.value = -height
    translateYValue.value = withTiming(0, { duration: 500 })

    opacityValue.value = withTiming(1, { duration: 500 })
  }

  const handlePress = (account: TAccount) => {
    navigation.navigate('AccountScreen', {
      account,
      wallet,
    })
  }

  const handleMorePress = () => {
    navigation.navigate('WalletSettingsScreen', {
      wallet,
    })
  }

  useEffect(() => {
    dispatch(walletReducerActions.saveWallet({ ...wallet, lastVisitedAt: new Date().toISOString() }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenLayout.Root onLayout={handleLayout}>
      <ScreenLayout.Header className="h-[46px]">
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{wallet.name}</ScreenLayout.Title>
        <ScreenLayout.ButtonContent position="right">
          <TwIconButton
            aria-label={t('moreButtonLabel')}
            icon={<MdMoreHoriz aria-hidden className="text-white" />}
            size="md"
            onPress={handleMorePress}
          />
        </ScreenLayout.ButtonContent>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent className="pb-0">
        <Animated.View className="w-full flex-shrink flex-grow" style={[animatedStyles]}>
          <AccountCardStackList
            accounts={accountsByWalletId}
            onPress={handlePress}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
            contentContainerStyle={{ paddingBottom: ConstantsHelper.footerHeight }}
            ListFooterComponent={
              wallet.type === 'standard' || (wallet.type === 'hardware' && hasHardwareAccount) ? (
                <PressableScale
                  onPress={createNewAccountAction.handleAct}
                  className="mb-4 mt-10 flex w-full flex-row items-center justify-center gap-1 rounded-2xl border border-dashed border-gray-100/50"
                  style={{ width: accountCardDimensions.width, height: accountCardDimensions.height }}
                >
                  {createNewAccountAction.isActing ? (
                    <Loader />
                  ) : (
                    <Fragment>
                      <MdAdd aria-hidden className="size-7 text-gray-100/50" />
                      <Text className="font-sans-medium text-lg text-gray-100/50">{t('addNewAccountButtonLabel')}</Text>
                    </Fragment>
                  )}
                </PressableScale>
              ) : undefined
            }
          />
        </Animated.View>
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}
