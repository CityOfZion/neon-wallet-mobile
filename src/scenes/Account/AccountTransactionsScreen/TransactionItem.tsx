import { TransactionResponse, hasExplorerService } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import moment from 'moment'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { TransferItem } from './TransferItem'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BoxLabelNumber } from '~/src/components/BoxLabelNumber'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = TransactionResponse & {
  withExplorer?: boolean
  account: Account
  exchange?: MultiExchange
}

export const TransactionItem = React.memo(({ withExplorer = true, ...props }: Props) => {
  const service = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[props.account.blockchain]
  )
  const navigation = useNavigation<StackNavigationProp<WalletStackParamList & RootStackParamList>>()

  const explorerURI = hasExplorerService(service) ? service.explorerService.buildTransactionUrl(props.hash) : undefined

  function handleOnPressButtonExplorer() {
    if (!explorerURI) return

    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WebViewModal.name,
      params: {
        uri: explorerURI,
        title: 'Transaction Information',
      },
    })
  }

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

          {withExplorer && explorerURI && (
            <TouchableWithoutFeedback onPress={handleOnPressButtonExplorer}>
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
