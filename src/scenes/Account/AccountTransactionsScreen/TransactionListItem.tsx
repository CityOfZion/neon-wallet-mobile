import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import { View, Image, FlatList } from 'react-native'

import { FormattedTransaction } from './AccountTransactionsScreen'
import { TransactionItem } from './TransactionItem'

import { Account } from '~/src/models/redux/Account'
import { LinearLayout, TextView } from '~/src/styles/styled-components'
import { Exchange } from '~/src/types/exchange'

interface Props {
  completedTransactions: FormattedTransaction[] | undefined
  pendingTransactions: FormattedTransaction[] | undefined
  account: Account
  date: string
  exchange?: Exchange
}

export const TransactionListItem = React.memo(
  ({ account, completedTransactions, pendingTransactions, date, exchange }: Props) => {
    return (
      <LinearLayout mb="10px">
        <TextView mb="20px" color="#fff" fontFamily="semibold" fontSize="30px">
          {moment(date).format(i18n.t('formatters.transactionsPerDate'))}
        </TextView>

        {pendingTransactions && pendingTransactions.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ marginRight: 5, width: 18, height: 18 }}
                source={require('src/assets/images/icon-pending-white.png')}
              />
              <TextView color="#899fa8">{i18n.t('screens.accountTransaction.pendingTransactions')}</TextView>
            </View>
            <FlatList
              data={pendingTransactions}
              listKey={`pendingTransaction-${date}`}
              keyExtractor={item => item.hash}
              renderItem={({ item }) => (
                <TransactionItem exchange={exchange} account={account} hideLinkDora {...item} />
              )}
            />
          </>
        )}

        {completedTransactions && completedTransactions.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ marginRight: 5, width: 18, height: 18 }}
                source={require('src/assets/images/icon-check-white.png')}
              />
              <TextView color="#899fa8">{i18n.t('screens.accountTransaction.completedTransactions')}</TextView>
            </View>
            <FlatList
              data={completedTransactions}
              listKey={`completedTransaction-${date}`}
              keyExtractor={item => item.hash}
              renderItem={({ item }) => <TransactionItem exchange={exchange} account={account} {...item} />}
            />
          </>
        )}
      </LinearLayout>
    )
  }
)
