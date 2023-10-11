import { TransactionResponse } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import { FlatList } from 'react-native'

import { TransactionItem } from './TransactionItem'

import { Account } from '~/src/store/account/Account'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

interface Props {
  completedTransactions: TransactionResponse[]
  pendingTransactions: TransactionResponse[]
  account: Account
  date: string
  exchange?: MultiExchange
}

export const TransactionListItem = React.memo(
  ({ account, completedTransactions, pendingTransactions, date, exchange }: Props) => {
    return (
      <LinearLayout mb="10px">
        <TextView color="text.0" fontFamily="semibold" fontSize="30px">
          {moment(date).format(i18n.t('formatters.transactionsPerDate'))}
        </TextView>

        {pendingTransactions && pendingTransactions.length > 0 && (
          <>
            <LinearLayout flexDirection="row" alignItems="center" mt="20px">
              <ImageView
                mr="6px"
                style={{ width: 18, height: 18 }}
                source={require('src/assets/images/icon-pending-white.png')}
              />
              <TextView color="text.6">{i18n.t('screens.accountTransaction.pendingTransactions')}</TextView>
            </LinearLayout>
            <FlatList
              data={pendingTransactions}
              listKey={`pendingTransaction-${date}`}
              keyExtractor={item => item.hash}
              renderItem={({ item }) => (
                <TransactionItem exchange={exchange} account={account} withExplorer={false} {...item} />
              )}
            />
          </>
        )}

        {completedTransactions && completedTransactions.length > 0 && (
          <>
            <LinearLayout flexDirection="row" alignItems="center" mt="20px">
              <ImageView
                mr="6px"
                style={{ width: 18, height: 18 }}
                source={require('src/assets/images/icon-check-white.png')}
              />
              <TextView color="text.6">{i18n.t('screens.accountTransaction.completedTransactions')}</TextView>
            </LinearLayout>
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
