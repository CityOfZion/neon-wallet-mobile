import i18n from 'i18n-js'
import React, {useState, useCallback, useEffect} from 'react'
import {
  Linking,
  View,
  TouchableWithoutFeedback,
  ImageSourcePropType,
  Image,
} from 'react-native'
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
  statusTransactions: string
  iconStatusTransactions: ImageSourcePropType
}

export const TransactionItemDate = (
  props: TransactionDataScreenWithStatusTransactions
) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()
  const account = dispatch(RootStore.account.actions.getFromSelection())
  const [sentOrReceiveStatus, setSentOrReceiveStatus] = useState<string>(
    i18n.t('screens.getAccount.sentToLabel')
  )

  const handleChangeSentOrReceiveStatus = useCallback(() => {
    const transfer = props.transfers.find(
      (transfer) => transfer.addressTo === account.address
    )
    if (transfer) {
      setSentOrReceiveStatus(i18n.t('screens.getAccount.receivedFromLabel'))
    }
  }, [account, props.transfers])

  useEffect(() => {
    handleChangeSentOrReceiveStatus()
  }, [account, props.transfers])

  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{marginRight: 5, width: 18, height: 18}}
          source={props.iconStatusTransactions}
        />
        <TextView color="#899fa8">{props.statusTransactions}</TextView>
      </View>
      <View
        style={{
          backgroundColor: '#0f0f10',
          borderRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 20,
          marginTop: 15,
        }}
      >
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10}}
        >
          <TextView color="#fff" fontFamily="medium" fontSize="18px">
            {i18n.t('screens.getAccount.txidLabel')}
          </TextView>
          <TextView
            ellipsizeMode={'middle'}
            numberOfLines={1}
            color="primary"
            fontFamily="medium"
            fontSize="16px"
          >
            {props.txid}
          </TextView>
        </View>
        <View>
          <TextView color="#899fa8" fontSize="14px" fontFamily="medium">
            {sentOrReceiveStatus}
          </TextView>
          {props.transfers.map((transfer, index) => (
            <TransferItem key={index} {...transfer} />
          ))}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{flexDirection: 'row'}}>
            <BoxLabelNumber
              color={'#1f2b33'}
              label={i18n.t('screens.getAccount.invocationsLabel')}
              number={props.qtyInvocations}
            />
            <BoxLabelNumber
              color={'#1f2b33'}
              label={i18n.t('screens.getAccount.notificationsLabel')}
              number={props.qtyNotifications}
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Linking.openURL(
                blockchainServices[account.blockchain].provider.siteUrlQuery +
                  props.txid
              )
            }}
          >
            <ImageView
              width="28px"
              height="28px"
              source={require('~src/assets/images/dora-link.png')}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  )
}
