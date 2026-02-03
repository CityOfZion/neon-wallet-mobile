import React, { useMemo } from 'react'

import type { FlatListProps, ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { AccountCard } from './AccountCard'

import type { IAccountState } from '@/types/store'

type TItem = IAccountState & {
  onPress: (account: IAccountState) => void
  isStack: boolean
  width?: number
}

type TProps = {
  accounts: IAccountState[]
  onPress: (account: IAccountState) => void
  width?: number
} & Omit<FlatListProps<TItem>, 'data' | 'keyExtractor' | 'CellRendererComponent' | 'renderItem'>

const renderItem: ListRenderItem<TItem> = ({ item, index }) => {
  return (
    <AccountCard
      hideBalance={false}
      account={item}
      isStack={item.isStack}
      isCompacted={!item.isStack}
      width={item.width}
      onPress={item.onPress.bind(null, item)}
      style={{ marginTop: index > 0 ? `-35%` : undefined, zIndex: index, transformOrigin: undefined }}
    />
  )
}

export const AccountCardStackList = ({ accounts, onPress, width, ...props }: TProps) => {
  const data = useMemo<TItem[]>(() => {
    return accounts.map((account, index) => ({
      ...account,
      onPress,
      isStack: accounts.length - 1 !== index,
      width,
    }))
  }, [accounts, onPress, width])

  return (
    <FlatList
      data={data}
      contentContainerClassName="items-center"
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      {...props}
    />
  )
}
