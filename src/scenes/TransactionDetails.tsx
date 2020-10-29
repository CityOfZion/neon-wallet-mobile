import { RouteProp, useNavigation, CommonActions } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import {
  Linking,
} from 'react-native'
import { useSelector } from 'react-redux'

import { Facade } from '~src/app/Facade'
import { AccountView } from '~src/components/AccountView'
import { HeaderColumn } from '~src/components/HeaderColumn'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import { TokenView } from '~src/components/TokenView'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {
  FasterPriority,
  FastPriority,
  NoPriority,
  PriorityFee,
} from '~src/models/PriorityFee'
import { Contact } from '~src/models/redux/Contact'
import { SenderTransaction } from '~src/models/redux/SenderTransaction'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface TransactionDetailsParams {
  transaction: SenderTransaction
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'TransactionDetails'>
}

export const TransactionDetails = (props: Props) => {
  const controller = useSwiperController(true)
  const transaction = props.route.params.transaction
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const { currency, language } = useSelector((state: RootState) => state.settings)

  let senderName = undefined
  const senderAddress = transaction.senderAddress ?? undefined

  let senderWallet = undefined
  let receiverWallet = undefined

  let receiverName = undefined
  const receiverAddress = transaction.receiverAddress ?? undefined

  const senderAccount = accounts.find(
    (account) => account.address === senderAddress
  )
  if (senderAccount) {
    senderWallet = senderAccount.getWallet(wallets)?.name
  } else {
    const contact = contacts.find(
      (value) => value.address === transaction.senderAddress
    )
    senderName = contact?.name ?? undefined
  }
  const receiverAccount = accounts.find(
    (account) => account.address === receiverAddress
  )

  if (receiverAccount) {
    receiverWallet = receiverAccount.getWallet(wallets)?.name
  } else {
    const contact = contacts.find(
      (value) => value.address === transaction.receiverAddress
    )
    receiverName = contact?.name ?? undefined
  }

  return (
    <SwiperPanel
      controller={controller}
      title={'Transaction details'}
      fullSize={true}
      onClose={() => props.navigation.goBack()}
      onRightPress={controller.close}
      rightButton={<CloseButton mr="20px" />}
    >
      <LinearLayout
        orientation={'verti'}
        alignContent={'flex-start'}
        mt={'30px'}
        flex={1}
      >
        <LinearLayout orientation={'horiz'}>
          <HeaderColumn
            title={Facade.t('transactionDetails.time').toUpperCase()}
            value={transaction.formattedTime ?? 'undefined'}
            weight={1}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.date').toUpperCase()}
            value={transaction.formattedDate ?? 'undefined'}
            weight={1.5}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.status').toUpperCase()}
            value={
              transaction.isPending
                ? Facade.t('transactionDetails.pending')
                : Facade.t('transactionDetails.confirmed')
            }
            weight={1.6}
            image={require('~/src/assets/images/icon-pending-white.png')}
          />
        </LinearLayout>
        <LinearLayout orientation={'horiz'}>
          <HeaderColumn
            title={Facade.t('transactionDetails.value').toUpperCase()}
            value={Facade.filter.currency(
              transaction.token?.exchangeToken(currency),
              currency,
              language
            )}
            weight={2}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.priorityFee').toUpperCase()}
            value={`${transaction.feeAmount?.fee ?? 0} GAS`}
            weight={1.2}
            priorityFee={transaction.feeAmount ?? undefined}
          />
        </LinearLayout>
        <LinearLayout orientation={'horiz'}>
          <HeaderColumn
            weight={1}
            title={'HASH'}
            value={transaction.transactionHash ?? ''}
            showCopy={true}
          />
        </LinearLayout>
        <LinearLayout orientation={'horiz'}>
          <LinearLayout mr={2} mt={5} alignSelf={'center'}>
            <ImageView
              width={Facade.scale(18)}
              resizeMode={'contain'}
              source={require('~src/assets/images/arrow-gray.png')}
            />
          </LinearLayout>
          <TextView
            color={'text.10'}
            fontFamily={'medium'}
            fontSize={18}
            mt={4}
          >
            {Facade.t('transactionDetails.sender')}
          </TextView>
        </LinearLayout>
        <AccountView
          contactName={senderName}
          address={senderAddress ?? ''}
          accountName={senderAccount?.name ?? undefined}
          walletName={senderWallet ?? undefined}
        />
        <LinearLayout orientation={'horiz'}>
          <LinearLayout mr={2} mt={5} alignSelf={'center'}>
            <ImageView
              width={Facade.scale(18)}
              resizeMode={'contain'}
              source={require('~src/assets/images/arrow-receive-gray.png')}
            />
          </LinearLayout>
          <TextView
            color={'text.10'}
            fontFamily={'medium'}
            fontSize={18}
            mt={4}
          >
            {Facade.t('transactionDetails.recipient')}
          </TextView>
        </LinearLayout>
        <AccountView
          contactName={receiverName}
          address={receiverAddress ?? ''}
          accountName={receiverAccount?.name ?? undefined}
          walletName={receiverWallet ?? undefined}
        />
        <TokenView transaction={transaction} />
        <LinearLayout weight={1} mt={'30px'}>
          <ThemedButton
            onPress={() => {
              Linking.openURL(
                `https://dora.coz.io/transaction/0x${transaction.transactionHash}`
              )
            }}
            label={Facade.t('transactionDetails.viewOnDora')}
            srcIcon={require('~/src/assets/images/icon-dora-green.png')}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}
