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
}

export const TransactionsListDate = (props: TransactionsListDateProps) => {
  return (
    <LinearLayout mb={'10px'}>
      <TextView mb={'20px'} color="#fff" fontFamily="semibold" fontSize="30px">
        {moment(props.date).format('DD MMMM')}
      </TextView>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{marginRight: 5, width: 18, height: 18}}
          source={require('src/assets/images/icon-check-white.png')}
        />
        <TextView color="#899fa8">
          {i18n.t('screens.getAccount.completedTransactions')}
        </TextView>
      </View>
      {props.transactions.map((transaction) => (
        <TransactionItemDate key={transaction.txid} {...transaction} />
      ))}
    </LinearLayout>
  )
}
