import I18n from 'i18n-js'
import moment from 'moment'
import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList } from 'react-native'

import { FormattedTransaction } from './AccountTransactionsScreen'
import { TransactionListItem } from './TransactionListItem'

import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import { FlatListFooter } from '~/src/components/FlatListFooter'
import { Account } from '~/src/models/redux/Account'
import { LinearLayout } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

interface TransactionsListDateProps {
  completedTransactions: FormattedTransaction[]
  pendingTransactions: FormattedTransaction[]
  account: Account
  onEndReached(): Promise<void>
  showMoreLoading: boolean
  exchange?: MultiExchange
}

export const TransactionsList = ({
  pendingTransactions,
  completedTransactions,
  account,
  onEndReached,
  showMoreLoading,
  exchange,
}: TransactionsListDateProps) => {
  const separateTransactionsPerDate = useCallback((transactions: FormattedTransaction[]) => {
    const transactionsPerDate: Record<string, FormattedTransaction[]> = {}

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
  }, [])

  const completedTransactionsPerDate = useMemo(
    () => separateTransactionsPerDate(completedTransactions),
    [separateTransactionsPerDate, completedTransactions]
  )

  const pendingTransactionsPerDate = useMemo(
    () => separateTransactionsPerDate(pendingTransactions),
    [separateTransactionsPerDate, pendingTransactions]
  )

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
