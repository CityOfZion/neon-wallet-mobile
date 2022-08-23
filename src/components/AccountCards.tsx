import React from 'react'
import { FlatList, Platform, StyleProp, ViewStyle } from 'react-native'

import { Account } from '../models/redux/Account'
import { LinearLayout } from '../styles/styled-components'
import { UseMultipleBalanceAndExchangeResult } from '../types/query'
import AccountCard from './AccountCard'

interface Props {
  accounts: Account[]
  onPress: (account: Account) => void
  balanceExchange: UseMultipleBalanceAndExchangeResult
  contentContainerStyle?: StyleProp<ViewStyle>
}

type CellProps = {
  index: number
}

const Cell = React.memo((props: CellProps) => (
  <LinearLayout marginTop={props.index > 0 ? `-125px` : undefined} zIndex={props.index} {...props} />
))

export const AccountCards = ({ accounts, balanceExchange, onPress, contentContainerStyle }: Props) => {
  const getBalanceExchange = (account: Account) => {
    if (!account.address) return

    return balanceExchange.findByBalanceKey(account.address)
  }

  return (
    <LinearLayout mt={Platform.OS === 'ios' ? '5%' : 0}>
      <FlatList
        data={accounts}
        keyExtractor={item => `${item.address}`}
        contentContainerStyle={contentContainerStyle}
        CellRendererComponent={Cell}
        renderItem={({ item, index }) => (
          <AccountCard
            hideBalance={false}
            balanceExchange={getBalanceExchange(item)}
            account={item}
            isStack={accounts.length - 1 !== index}
            isCompacted
            onPress={() => onPress(item)}
          />
        )}
      />
    </LinearLayout>
  )
}
