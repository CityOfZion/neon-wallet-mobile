import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import {Linking, View, TouchableWithoutFeedback} from 'react-native'
import {useDispatch} from 'react-redux'

import {TransactionDataScreen} from '.'
import {TransferItem} from './TransferItem'

import {blockchainServices} from '~/src/blockchain'
import {BoxLabelNumber} from '~/src/components/BoxLabelNumber'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, TextView} from '~/src/styles/styled-components'

interface TransactionDataScreenWithStatusTransactions
  extends TransactionDataScreen {
  hideLinkDora?: boolean
}

// eslint-disable-next-line react/display-name
export const TransactionItemDate = React.memo(
  (props: TransactionDataScreenWithStatusTransactions) => {
    const dispatch = useDispatch<SyncDispatch<Account>>()
    const account = dispatch(RootStore.account.actions.getFromSelection())

    return (
      <View style={{marginBottom: 5}}>
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
                ellipsizeMode={'middle'}
                numberOfLines={1}
                color="primary"
                fontFamily="medium"
                fontSize="16px"
                width="60%"
                ml="10px"
              >
                {props.txid}
              </TextView>
            </View>
            <TextView color="#fff" fontFamily="medium" fontSize="16px">
              {moment(props.time).format(i18n.t('formatters.transactionTime'))}
            </TextView>
          </View>

          <View>
            {props.transfers.map((transfer) => (
              <TransferItem key={transfer.hash} {...transfer} />
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <View style={{flexDirection: 'row'}}>
              <BoxLabelNumber
                color={'#1f2b33'}
                label={i18n.t('screens.accountTransaction.invocationsLabel')}
                number={props.qtyInvocations}
              />
              <BoxLabelNumber
                color={'#1f2b33'}
                label={i18n.t('screens.accountTransaction.notificationsLabel')}
                number={props.qtyNotifications}
              />
            </View>

            {!props.hideLinkDora && (
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openURL(
                    blockchainServices[account.blockchain].provider
                      .siteUrlQuery + props.txid
                  )
                }}
              >
                <ImageView
                  width="28px"
                  height="28px"
                  resizeMode="contain"
                  alignSelf="center"
                  source={require('~src/assets/images/dora-link.png')}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    )
  }
)
