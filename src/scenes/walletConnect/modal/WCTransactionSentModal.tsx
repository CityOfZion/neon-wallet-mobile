import {RouteProp, useNavigation} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {Linking, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {blockchainServices} from '~src/blockchain'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import TransactionFailed from '~src/scenes/walletConnect/modal/fragment/TransactionFailed'
import TransactionSuccess from '~src/scenes/walletConnect/modal/fragment/TransactionSuccess'
import {LinearLayout} from '~src/styles/styled-components'
export interface WCTransactionSentModalParams {
  transaction?: SenderTransaction
  errorMessage?: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCTransactionSentModal'>
}

const WCTransactionSentModal = (props: Props) => {
  const controller = useSwiperController(true)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const navigation = useNavigation()
  const transaction = props.route.params.transaction
  const senderAddress = transaction?.senderAddress ?? undefined

  const senderAccount = accounts.find(
    (account) => account.address === senderAddress
  )

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      title={i18n.t('modals.transactionSent.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      onClose={controller.close}
      disableDefaultScrollView={true}
      disableScrolling
      padding={0}
      solidColorBG
    >
      <ScrollView
        style={{
          height: '80%',
          width: '100%',
          marginBottom: '10%',
          position: 'absolute',
          right: 0,
          left: 0,
        }}
        contentContainerStyle={{
          flexDirection: 'column',
          alignSelf: 'center',
        }}
      >
        {transaction?.transactionHash ? (
          <TransactionSuccess transactionHash={transaction.transactionHash} />
        ) : (
          <TransactionFailed
            errorMessage={props.route.params?.errorMessage ?? ''}
          />
        )}
      </ScrollView>

      <LinearLayout
        orientation={'verti'}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'100%'}
        height={'20%'}
        position={'absolute'}
        bottom={'50px'}
      >
        <ThemedButton
          width={'90%'}
          disabled={!transaction?.transactionHash}
          label={i18n.t('modals.transactionSent.viewTransaction')}
          onPress={() => {
            navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.TransactionDetails.name,
              params: {
                transaction: transaction?.transactionHash,
              },
            })
          }}
        />
        <ThemedButton
          width={'90%'}
          label={i18n.t('modals.transactionSent.viewOnDora')}
          disabled={!transaction?.transactionHash}
          onPress={() => {
            if (senderAccount?.blockchain) {
              Linking.openURL(
                blockchainServices[senderAccount.blockchain]?.provider
                  .siteUrlQuery + transaction?.transactionHash
              )
            }
          }}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default WCTransactionSentModal
