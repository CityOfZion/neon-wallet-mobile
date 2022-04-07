import i18n from 'i18n-js'
import moment from 'moment'
import React, {useCallback, useMemo} from 'react'
import {View, Image, Alert} from 'react-native'

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
  const formatTransactionsPerDate = useCallback(
    (
      transactions: TransactionDataScreen[],
      initialData: Record<string, TransactionDataScreen[]> = {}
    ) => {
      const transactionsPerDate: Record<
        string,
        TransactionDataScreen[]
      > = initialData

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
    () => formatTransactionsPerDate(completedTransactions),
    [formatTransactionsPerDate, completedTransactions]
  )
  const pendingTransactionsPerDate = useMemo(
    () => formatTransactionsPerDate(pendingTransactions),
    [formatTransactionsPerDate, pendingTransactions]
  )

  const dates = [
    ...Object.keys(completedTransactionsPerDate),
    ...Object.keys(pendingTransactionsPerDate),
  ]
    .filter((date, index, array) => array.indexOf(date) === index)
    .sort((a, b) => moment(a).diff(moment(b)))

  return (
    <>
      {dates.map((date) => (
        <LinearLayout mb={'10px'} key={date}>
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
                {pendingTransactionsPerDate[date].map((transaction) => (
                  <TransactionItemDate
                    hideLinkDora={true}
                    key={transaction.txid}
                    {...transaction}
                  />
                ))}
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
                {completedTransactionsPerDate[date].map((transaction) => (
                  <TransactionItemDate
                    key={transaction.txid}
                    {...transaction}
                  />
                ))}
              </>
            )}
        </LinearLayout>
      ))}
    </>
  )
}
