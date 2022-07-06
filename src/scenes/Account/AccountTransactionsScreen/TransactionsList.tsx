import I18n from 'i18n-js'
import moment from 'moment'
import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

import { FormattedTransaction } from './AccountTransactionsScreen';
import { TransactionListItem } from './TransactionListItem';

import { FlatListEmpty } from '~/src/components/FlatListEmpty';
import { FlatListFooter } from '~/src/components/FlatListFooter';
import { useExchange } from '~/src/hooks/useExchange';
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout } from '~/src/styles/styled-components';

interface TransactionsListDateProps {
  completedTransactions: FormattedTransaction[]
  pendingTransactions: FormattedTransaction[]
  account: Account
  onEndReached(): Promise<void>
  showMoreLoading: boolean
  refetchTransacions?: () => Promise<void>
}

export const TransactionsList = ({
  pendingTransactions,
  completedTransactions,
  account,
  onEndReached,
  showMoreLoading,
  refetchTransacions,
}: TransactionsListDateProps) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { isRefetching, refetch } = useExchange({ filter: { currencies: currency } })
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

  const handleRefetch = async () => {
    await refetch()
    if (refetchTransacions) {
      await refetchTransacions()
    }
  }

  return (
    <LinearLayout my="44px">
      <FlatList
        refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={handleRefetch} />}
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
          />
        )}
      />
    </LinearLayout>
  )
}
