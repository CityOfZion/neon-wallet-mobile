import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import { Linking, View, TouchableWithoutFeedback } from 'react-native'

import { FormattedTransaction } from './AccountTransactionsScreen'
import { TransferItem } from './TransferItem'

import { blockchainServices } from '~/src/blockchain'
import { BoxLabelNumber } from '~/src/components/BoxLabelNumber'
import { Account } from '~/src/models/redux/Account'
import { ImageView, TextView } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = FormattedTransaction & {
  hideLinkDora?: boolean
  account: Account
  exchange?: MultiExchange
}

export const TransactionItem = React.memo((props: Props) => {
  return (
    <View style={{ marginBottom: 5 }}>
      <View
        style={{
          backgroundColor: '#0f0f10',
          borderRadius: 8,
          paddingHorizontal: 14,
          marginTop: 15,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 10,
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <TextView color="#fff" fontFamily="medium" fontSize="18px">
              {i18n.t('screens.accountTransaction.txidLabel')}
            </TextView>
            <TextView
              ellipsizeMode="middle"
              numberOfLines={1}
              color="primary"
              fontFamily="medium"
              fontSize="16px"
              width="60%"
              ml="10px"
            >
              {props.hash}
            </TextView>
          </View>
          <TextView color="#fff" fontFamily="medium" fontSize="16px">
            {moment.unix(props.time).format(i18n.t('formatters.transactionTime'))}
          </TextView>
        </View>

        <View>
          {props.transfers.map(transfer => (
            <TransferItem key={transfer.hash} account={props.account} exchange={props.exchange} {...transfer} />
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <BoxLabelNumber
              color="#1f2b33"
              label={i18n.t('screens.accountTransaction.invocationsLabel')}
              number={props.qtyInvocations}
            />
            <BoxLabelNumber
              color="#1f2b33"
              label={i18n.t('screens.accountTransaction.notificationsLabel')}
              number={props.qtyNotifications}
            />
          </View>

          {!props.hideLinkDora && (
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(blockchainServices[props.account.blockchain].provider.siteUrlQuery + props.hash)
              }}
            >
              <ImageView
                resizeMode="contain"
                alignSelf="center"
                source={require('~src/assets/images/dora-link.png')}
                style={{
                  width: 28,
                  height: 28,
                }}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    </View>
  )
})
