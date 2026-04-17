import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'

import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import { WalletAccordionItem } from './WalletAccordionItem'

import type { TAccount, TWallet } from '@/types/store'

type TItem = { accounts: TAccount[]; wallet: TWallet }

const renderItem: ListRenderItem<TItem> = ({ item, index }) => (
  <WalletAccordionItem defaultOpened={index === 0} wallet={item.wallet} accounts={item.accounts} />
)

export const BuyAndSellTokensAccountsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensAccounts' })
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

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ViewContent className="gap-y-2 pb-0">
        {data.length !== 0 && (
          <Text className="mx-3 mb-4 font-sans-regular text-lg text-white">{t('description')}</Text>
        )}

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
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
