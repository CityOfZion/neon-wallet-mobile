import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import {View, Image} from 'react-native'

import {TransactionDataScreen} from '.'
import {TransactionItemDate} from './TransactionItemDate'

import {LinearLayout, TextView} from '~/src/styles/styled-components'

interface TransactionsListDateProps {
  date: string
  transactions: TransactionDataScreen[]
  pendingTransactions: TransactionDataScreen[]
}

export const TransactionsListDate = (props: TransactionsListDateProps) => {
  return (
    <LinearLayout mb={'10px'}>
      <TextView mb={'20px'} color="#fff" fontFamily="semibold" fontSize="30px">
        {moment(props.date).format('DD MMMM')}
      </TextView>
      {props.pendingTransactions.map((pendingTransaction) => (
        <TransactionItemDate
          iconStatusTransactions={require('src/assets/images/icon-pending-white.png')}
          key={pendingTransaction.txid}
          statusTransactions={i18n.t('components.transactionList.title')}
          {...pendingTransaction}
        />
      ))}
      {props.transactions.map((transaction) => (
        <TransactionItemDate
          iconStatusTransactions={require('src/assets/images/icon-check-white.png')}
          key={transaction.txid}
          statusTransactions={i18n.t(
            'screens.getAccount.completedTransactions'
          )}
          {...transaction}
        />
      ))}
    </LinearLayout>
  )
}
