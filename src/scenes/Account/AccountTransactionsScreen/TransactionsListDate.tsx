import i18n from 'i18n-js'
import moment from 'moment'
import React, {useCallback, useMemo} from 'react'
import {View, Image, FlatList} from 'react-native'

import {TransactionDataScreen} from '.'
import {TransactionItemDate} from './TransactionItemDate'

import {LinearLayout, TextView} from '~/src/styles/styled-components'

interface TransactionsListDateProps {
  completedTransactions: TransactionDataScreen[]
  pendingTransactions: TransactionDataScreen[]
}

export const TransactionsListDate = ({
  pendingTransactions,
  completedTransactions,
}: TransactionsListDateProps) => {
  const separateTransactionsPerDate = useCallback(
    (transactions: TransactionDataScreen[]) => {
      const transactionsPerDate: Record<string, TransactionDataScreen[]> = {}

      transactions.forEach((transaction) => {
        const {time} = transaction

        const date = moment(time).format('YYYY-MM-DD')

        if (date in transactionsPerDate) {
          transactionsPerDate[date].push(transaction)
          return
        }

        transactionsPerDate[date] = [transaction]
      })

      return transactionsPerDate
    },
    []
  )

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
      [
        ...Object.keys(completedTransactionsPerDate),
        ...Object.keys(pendingTransactionsPerDate),
      ]
        .filter((date, index, array) => array.indexOf(date) === index) //Remove duplicates
        .sort((a, b) => moment(b).diff(a)),
    [completedTransactionsPerDate, pendingTransactionsPerDate]
  )

  return (
    <FlatList
      data={dates}
      keyExtractor={(item) => item}
      renderItem={({item: date}) => (
        <LinearLayout mb={'10px'}>
          <TextView
            mb={'20px'}
            color="#fff"
            fontFamily="semibold"
            fontSize="30px"
          >
            {moment(date).format(i18n.t('formatters.transactionsPerDate'))}
          </TextView>

          {pendingTransactionsPerDate[date] &&
            pendingTransactionsPerDate[date].length > 0 && (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{marginRight: 5, width: 18, height: 18}}
                    source={require('src/assets/images/icon-pending-white.png')}
                  />
                  <TextView color="#899fa8">
                    {i18n.t(
                      'components.accountTransaction.pendingTransactions'
                    )}
                  </TextView>
                </View>
                <FlatList
                  data={pendingTransactionsPerDate[date]}
                  keyExtractor={(item) => item.txid}
                  renderItem={({item}) => (
                    <TransactionItemDate hideLinkDora={true} {...item} />
                  )}
                />
              </>
            )}

          {completedTransactionsPerDate[date] &&
            completedTransactionsPerDate[date].length > 0 && (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{marginRight: 5, width: 18, height: 18}}
                    source={require('src/assets/images/icon-check-white.png')}
                  />
                  <TextView color="#899fa8">
                    {i18n.t('screens.accountTransaction.completedTransactions')}
                  </TextView>
                </View>
                <FlatList
                  data={completedTransactionsPerDate[date]}
                  keyExtractor={(item) => item.txid}
                  renderItem={({item}) => <TransactionItemDate {...item} />}
                />
              </>
            )}
        </LinearLayout>
      )}
    />
  )
}
