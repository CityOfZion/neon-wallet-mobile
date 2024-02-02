import i18n from 'i18n-js'
import React from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'

import { Account } from '../store/account/Account'
import { LinearLayout } from '../styles/styled-components'
import { UseMultipleBalanceAndExchangeResult } from '../types/query'
import AccountCard from './AccountCard'
import { FlatListEmpty } from './FlatListEmpty'

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
    return balanceExchange.findByBalanceKey(account.address)
  }

  return (
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
      ListEmptyComponent={<FlatListEmpty alignY="center" label={i18n.t('components.AccountCards.noAccounts')} />}
    />
  )
}
