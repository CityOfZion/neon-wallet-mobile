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
      {props.pendingTransactions && props.pendingTransactions.length > 0 && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{marginRight: 5, width: 18, height: 18}}
            source={props.pendingTransactions[0].iconStatusTransaction}
          />
          <TextView color="#899fa8">
            {props.pendingTransactions[0].statusTransaction}
          </TextView>
        </View>
      )}
      {props.pendingTransactions &&
        props.pendingTransactions.map((pendingTransaction) => (
          <TransactionItemDate
            hideLinkDora={true}
            hour={moment(pendingTransaction.time).format('hh:mm:a')}
            key={pendingTransaction.txid}
            {...pendingTransaction}
          />
        ))}
      {props.transactions.length > 0 && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{marginRight: 5, width: 18, height: 18}}
            source={props.transactions[0].iconStatusTransaction}
          />
          <TextView color="#899fa8">
            {props.transactions[0].statusTransaction}
          </TextView>
        </View>
      )}
      {props.transactions.map((transaction) => (
        <TransactionItemDate
          hour={moment(transaction.time).format('hh:mm:a')}
          key={transaction.txid}
          {...transaction}
        />
      ))}
    </LinearLayout>
  )
}
