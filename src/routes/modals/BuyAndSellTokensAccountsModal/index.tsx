import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'

import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useMount } from '@/hooks/useMount'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { WalletAccordionItem } from './WalletAccordionItem'

import type { IAccountState, IWalletState } from '@/types/store'

type TItem = { accounts: IAccountState[]; wallet: IWalletState }

const renderItem: ListRenderItem<TItem> = ({ item, index }) => (
  <WalletAccordionItem defaultOpened={index === 0} wallet={item.wallet} accounts={item.accounts} />
)

export const BuyAndSellTokensAccountsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensAccountsModal' })
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()

  const data = useMemo<TItem[]>(
    () =>
      wallets
        .filter(({ id }) => accounts.find(({ idWallet }) => idWallet === id))
        .map(wallet => ({
          wallet,
          accounts: accounts.filter(account => account.idWallet === wallet.id),
        })),
    [wallets, accounts]
  )

  const { isMounting } = useMount(() => {}, [])

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-xl"
      contentContainerClassName="pb-0 gap-y-2"
      withoutScroll
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      {data.length !== 0 && <Text className="mx-3 mb-4 font-sans-regular text-lg text-white">{t('description')}</Text>}

      <TwSkeleton
        className="flex flex-col gap-y-2"
        isLoading={isMounting}
        layout={[
          { width: '100%', height: 46 },
          { width: '100%', height: 46 },
          { width: '100%', height: 46 },
          { width: '100%', height: 46 },
        ]}
      >
        <FlatList
          data={data}
          contentContainerClassName="pb-24 gap-y-2"
          showsVerticalScrollIndicator={false}
          keyExtractor={({ wallet }) => wallet.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="mt-2 flex w-full items-center justify-center rounded-lg bg-asphalt/50 p-4">
              <Text className="text-center font-sans-medium text-sm text-white">{t('labels.emptyList')}</Text>
            </View>
          }
        />
      </TwSkeleton>
    </TwModalLayout>
  )
}
