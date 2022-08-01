import React from 'react'
import { FlatList } from 'react-native'

import { Account } from '../models/redux/Account'
import { LinearLayout } from '../styles/styled-components'
import { UseMultipleBalanceAndExchangeResult } from '../types/query'
import AccountCard from './AccountCard'

interface Props {
  accounts: Account[]
  onPress: (account: Account) => void
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

type CellProps = {
  index: number
}

const Cell = React.memo((props: CellProps) => (
  <LinearLayout marginTop={props.index > 0 ? `-130px` : undefined} zIndex={props.index} {...props} />
))

export const AccountCards = ({ accounts, balanceExchange, onPress }: Props) => {
  const getBalanceExchange = (account: Account) => {
    if (!account.address) return

    return balanceExchange.findByBalanceKey(account.address)
  }

  return (
    <FlatList
      data={accounts}
      keyExtractor={item => `${item.address}`}
      CellRendererComponent={Cell}
      renderItem={({ item }) => (
        <AccountCard
          hideBalance={false}
          balanceExchange={getBalanceExchange(item)}
          account={item}
          isCompacted
          onPress={() => onPress(item)}
        />
      )}
    />
  )
}
