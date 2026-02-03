import React, { Fragment, useLayoutEffect, useState } from 'react'

import { LinearGradient } from 'expo-linear-gradient'

import { BalanceList } from '@/components/BalanceList'
import { RefreshControl } from '@/components/RefreshControl'
import type { TWalletCardRef } from '@/components/WalletCard'
import { WalletCarousel } from '@/components/WalletCarousel'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'
import { useRefetch } from '@/hooks/useQuery'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import { WalletsScreenEmptyList } from './WalletsScreenEmptyList'
import { WalletsScreenHeader } from './WalletsScreenHeader'
import { WalletsScreenWalletInfo } from './WalletsScreenWalletInfo'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IWalletState } from '@/types/store'

export const WalletsScreen = ({ navigation }: TWalletsStackScreenProps<'WalletsScreen'>) => {
  const { wallets } = useWalletsSelector()
  const { refetch, isRefetching } = useRefetch()

  const [selectedWallet, setSelectedWallet] = useState<IWalletState | undefined>(wallets[0])

  const { accountsByWalletId } = useAccountsByWalletIdSelector(selectedWallet?.id ?? '')

  const handlePress = async (pressedWallet: IWalletState, ref: TWalletCardRef) => {
    ref.runOutAnimation(async () => {
      navigation.navigate('WalletScreen', { wallet: pressedWallet })

      await UtilsHelper.sleep(500) // wait navigation

      ref.resetAnimation()
    })
  }

  const handleRefresh = async () => {
    refetch()
  }

  useLayoutEffect(() => {
    setSelectedWallet(previousSelectedWallet => {
      const updatedSelectedWallet = wallets.find(({ id }) => id === previousSelectedWallet?.id)
      const [firstWallet] = wallets

      return updatedSelectedWallet || firstWallet
    })
  }, [wallets])

  return (
    <LinearGradient
      className="flex-grow"
      colors={['#1A2026', '#2B3239']}
      end={{ x: 0, y: 0 }}
      start={{ x: 0.8, y: 0.4 }}
    >
      <TwScreenLayout
        withoutHeader
        withoutScroll
        containerProps={{ className: 'bg-transparent' }}
        contentContainerClassName="p-0"
      >
        <BalanceList
          key={`wallets-length-${wallets.length}`}
          contentContainerClassName="px-5"
          accounts={accountsByWalletId}
          ListHeaderComponent={
            <Fragment>
              <WalletsScreenHeader selectedWallet={selectedWallet} />

              {wallets.length > 0 ? (
                <Fragment>
                  <WalletCarousel
                    wallets={wallets}
                    selectedWallet={selectedWallet}
                    onPress={handlePress}
                    onSelect={setSelectedWallet}
                  />

                  <WalletsScreenWalletInfo selectedWalletAccounts={accountsByWalletId} />
                </Fragment>
              ) : (
                <WalletsScreenEmptyList />
              )}
            </Fragment>
          }
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        />
      </TwScreenLayout>
    </LinearGradient>
  )
}
