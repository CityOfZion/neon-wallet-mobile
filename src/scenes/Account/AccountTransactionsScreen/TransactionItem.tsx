import { TransactionResponse } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import { Linking, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { TransferItem } from './TransferItem'

import { BoxLabelNumber } from '~/src/components/BoxLabelNumber'
import { DoraHelper } from '~/src/helpers/DoraHelper'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = TransactionResponse & {
  hideLinkDora?: boolean
  account: Account
  exchange?: MultiExchange
}

export const TransactionItem = React.memo((props: Props) => {
  const selectedNetwork = useSelector(
    (state: RootState) => state.settings.selectedBlockchainNetworks[props.account.blockchain]
  )

  return (
    <LinearLayout mb="6px">
      <LinearLayout borderRadius="8px" paddingX="14px" mt="15px" pb="20px" backgroundColor="background.21">
        <LinearLayout flexDirection="row" flexWrap="wrap" marginY="10px" justifyContent="space-between">
          <LinearLayout flexDirection="row">
            <TextView color="text.0" fontFamily="medium" fontSize="18px">
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
          </LinearLayout>
          <TextView color="text.0" fontFamily="medium" fontSize="16px">
            {moment.unix(props.time).format(i18n.t('formatters.transactionTime'))}
          </TextView>
        </LinearLayout>

        <LinearLayout>
          {props.transfers.map((transfer, index) => (
            <TransferItem
              key={`${props.hash}-${index}`}
              account={props.account}
              exchange={props.exchange}
              {...transfer}
            />
          ))}
        </LinearLayout>

        <LinearLayout flexDirection="row" justifyContent="space-between" mt="10px">
          <LinearLayout flexDirection="row">
            <BoxLabelNumber
              color="#1f2b33"
              label={i18n.t('screens.accountTransaction.invocationsLabel')}
              number={props.transfers.length}
            />
            <BoxLabelNumber
              color="#1f2b33"
              label={i18n.t('screens.accountTransaction.notificationsLabel')}
              number={props.notifications.length}
            />
          </LinearLayout>

          {!props.hideLinkDora && (
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(
                  DoraHelper.buildTransactionUrl(selectedNetwork.type, props.account.blockchain, props.hash)
                )
              }}
            >
              <ImageView
                resizeMode="contain"
                alignSelf="center"
                source={require('~src/assets/images/dora-link.png')}
                width={28}
                height={28}
              />
            </TouchableWithoutFeedback>
          )}
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
})
