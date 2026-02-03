import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { FlatListProps, ListRenderItem } from 'react-native'
import { FlatList, Pressable, Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountsWithWalletSelector } from '@/hooks/useAccountSelector'

import { TwBlockchainIcon } from './TwBlockchainIcon'
import { TwSeparator } from './TwSeparator'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { IAccountState, IWalletState, TAccountWithWallet } from '@/types/store'

type TItem = IAccountState & {
  wallet: IWalletState
  isSelected: boolean
  onPress: () => void
}

type TProps = {
  onPress: (account: IAccountState) => void
  selectedAccount?: IAccountState | null
  blockchains?: TBlockchainServiceKey[]
  accountsWithWallet?: TAccountWithWallet[]
} & Omit<FlatListProps<TItem>, 'data' | 'renderItem'>

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <Pressable
      onPress={item.onPress}
      className={StyleHelper.mergeStyles(
        'h-[52px] flex-row items-center justify-between gap-6 border-l-4 border-transparent pl-3.5 pr-4.5',
        {
          'border-neon bg-gray-900/50': item.isSelected,
        }
      )}
    >
      <View className="flex-shrink flex-grow flex-row items-center gap-5">
        <TwBlockchainIcon blockchain={item.blockchain} type="gray" className="mt-0.5 h-3.5 w-3.5" />

        <Text className="flex-shrink font-sans-medium text-lg text-white" numberOfLines={1} ellipsizeMode="middle">
          {item.address}
        </Text>
      </View>

      <View className="min-w-[50%] flex-shrink flex-row items-center">
        <Text className="font-sans-regular text-sm uppercase text-gray-100">{item.name}</Text>
        <Text
          className="flex-shrink font-sans-regular text-sm uppercase text-gray-300"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {` | ${item.wallet.name}`}
        </Text>
      </View>
    </Pressable>
  )
}

export const TwAccountList = ({ onPress, selectedAccount, blockchains, accountsWithWallet, ...props }: TProps) => {
  const { accountsWithWallet: internalAccountsWithWallet } = useAccountsWithWalletSelector()
  const { t } = useTranslation('components', { keyPrefix: 'twAccountList' })

  const items = useMemo(() => {
    const accountsWithWalletsToFilter = accountsWithWallet ?? internalAccountsWithWallet
    const filtered: TItem[] = []

    accountsWithWalletsToFilter.forEach(account => {
      if (blockchains && !blockchains.includes(account.blockchain)) {
        return
      }

      filtered.push({
        ...account,
        isSelected: selectedAccount?.id === account.id,
        onPress: () => {
          onPress(account)
        },
      })
    })

    return filtered

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountsWithWallet, internalAccountsWithWallet, selectedAccount])

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      getItemLayout={(_data, index) => ({ length: 52, offset: 52 * index, index })}
      ListEmptyComponent={
        <Text className="mt-5 text-center font-sans-medium text-lg text-gray-300">{t('emptyList')}</Text>
      }
      ItemSeparatorComponent={TwSeparator}
      {...props}
    />
  )
}
