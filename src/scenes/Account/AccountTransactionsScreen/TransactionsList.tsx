import { TransactionResponse } from '@cityofzion/blockchain-service'
import I18n from 'i18n-js'
import moment from 'moment'
import React, { useMemo, useRef } from 'react'
import { FlatList, RefreshControl } from 'react-native'

import { TransactionListItem } from './TransactionListItem'

import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import { FlatListFooter } from '~/src/components/FlatListFooter'
import { Account } from '~/src/store/account/Account'
import { LinearLayout } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

interface TransactionsListDateProps {
  transactions: TransactionResponse[]
  account: Account
  onEndReached(): Promise<void> | void
  refetch(): Promise<any>
  isRefetching: boolean
  showMoreLoading: boolean
  exchange?: MultiExchange
}

const separateTransactionsPerDate = (transactions: TransactionResponse[]) => {
  const transactionsPerDate: Record<string, TransactionResponse[]> = {}

  transactions.forEach(transaction => {
    const { time } = transaction
    const date = moment.unix(time).format('YYYY-MM-DD')

    if (date in transactionsPerDate) {
      transactionsPerDate[date].push(transaction)
      return
    }

    transactionsPerDate[date] = [transaction]
  })

  return transactionsPerDate
}

export const TransactionsList = ({
  transactions,
  account,
  onEndReached,
  showMoreLoading,
  exchange,
  isRefetching,
  refetch,
}: TransactionsListDateProps) => {
  const completedTransactionsPerDate = useMemo(() => separateTransactionsPerDate(transactions), [transactions])
  const pendingTransactionsPerDate = useMemo(() => separateTransactionsPerDate(account.pendingTransactions), [account])

  const dates = useMemo(
    () =>
      [...Object.keys(completedTransactionsPerDate), ...Object.keys(pendingTransactionsPerDate)]
        .filter((date, index, array) => array.indexOf(date) === index) //Remove duplicates
        .sort((a, b) => moment(b).diff(a)),
    [completedTransactionsPerDate, pendingTransactionsPerDate]
  )

  const onEndReachedCalledDuringMomentum = useRef(true)

  const handleEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current) {
      onEndReached()
    }
  }

  const handleMomentumScrollBegin = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      onEndReachedCalledDuringMomentum.current = true
    }
  }

  return (
    <LinearLayout my="44px">
      <FlatList
        data={dates}
        ListFooterComponent={showMoreLoading ? <FlatListFooter /> : undefined}
        ListEmptyComponent={<FlatListEmpty label={I18n.t('screens.accountTransaction.emptyList')} />}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={refetch} />}
        keyExtractor={item => item}
        renderItem={({ item: date }) => (
          <TransactionListItem
            account={account}
            completedTransactions={completedTransactionsPerDate[date]}
            pendingTransactions={pendingTransactionsPerDate[date]}
            date={date}
            exchange={exchange}
          />
        )}
      />
    </LinearLayout>
  )
}
