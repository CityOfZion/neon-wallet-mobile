import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {ImageLoadEventData, Linking, Modal, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {AccountView} from '~src/components/AccountView'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {
  FasterPriority,
  FastPriority,
  NoPriority,
  PriorityFee,
} from '~src/models/PriorityFee'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
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

function HeaderColumn(props: {
  weight: number
  title: string
  value: string
  image?: ImageLoadEventData
  priorityFee?: PriorityFee
  showCopy?: boolean
  valueTextColor?: string
}) {
  return (
    <LinearLayout orientation={'verti'} weight={props.weight} pt={2} mr={4}>
      <TextView color={'text.10'} fontFamily={'medium'} fontSize={14}>
        {props.title}
      </TextView>
      <LinearLayout orientation={'horiz'}>
        {props.image && (
          <ImageView alignSelf={'center'} source={props.image} mr={2} mt={1} />
        )}
        {props.priorityFee && (
          <TextView
            color={'primary'}
            fontFamily={'semibold'}
            fontSize={16}
            mr={2}
          >
            {props.priorityFee.name.toUpperCase()}
          </TextView>
        )}
        <ButtonView
          activeOpacity={props.showCopy ? 0.4 : 1}
          onPress={
            props.showCopy
              ? Facade.utils.copyToClipboard(props.value)
              : undefined
          }
        >
          <LinearLayout
            orientation={'horiz'}
            maxWidth={props.showCopy ? '95%' : '100%'}
          >
            <TextView
              color={props.valueTextColor ?? 'text.0'}
              fontFamily={'medium'}
              fontSize={16}
              numberOfLines={1}
              ellipsizeMode={'middle'}
            >
              {props.value}
            </TextView>
            {props.showCopy && (
              <ImageView
                width="16px"
                resizeMode="contain"
                source={require('~src/assets/images/icon-copy-green.png')}
                ml={4}
              />
            )}
          </LinearLayout>
        </ButtonView>
      </LinearLayout>
    </LinearLayout>
  )
}

export const TransactionDetails = (props: Props) => {
  const controller = useSwiperController(true)
  const transaction = props.route.params.transaction
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  let senderName = undefined
  const senderAddress =
    props.route.params.transaction.senderAddress ?? undefined

  let senderWallet = undefined
  let receiverWallet = undefined

  let receiverName = undefined
  const receiverAddress =
    props.route.params.transaction.receiverAddress ?? undefined

  const senderAccount = accounts.find(
    (account) => account.address === senderAddress
  )
  if (senderAccount) {
    senderWallet = senderAccount.getWallet(wallets)?.name
  } else {
    const contact = contacts.find(
      (value) => value.address === props.route.params.transaction.senderAddress
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
      (value) =>
        value.address === props.route.params.transaction.receiverAddress
    )
    receiverName = contact?.name ?? undefined
  }

  return (
    <SwiperPanel
      title={'Transaction details'}
      fullSize={true}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onClose={() => props.navigation.goBack()}
      controller={controller}
    >
      <LinearLayout
        orientation={'verti'}
        alignContent={'flex-start'}
        mt={'30px'}
        flex={1}
      >
        <LinearLayout orientation={'horiz'}>
          <HeaderColumn
            title={Facade.t('transactionDetails.time')}
            value={transaction.formattedTime ?? 'undefined'}
            weight={1}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.date')}
            value={transaction.formattedDate ?? 'undefined'}
            weight={1.5}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.status')}
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
            title={Facade.t('transactionDetails.value')}
            value={Facade.filter.currency(
              transaction.token?.exchangeToken(currency),
              currency,
              language
            )}
            weight={2}
          />
          <HeaderColumn
            title={Facade.t('transactionDetails.priorityFee')}
            value={`${transaction.feeAmount?.fee ?? 0} GAS`}
            weight={1.6}
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
        <TextView color={'text.10'} fontFamily={'medium'} fontSize={18} mt={4}>
          {Facade.t('transactionDetails.sender')}
        </TextView>
        <AccountView
          contactName={senderName}
          address={senderAddress ?? ''}
          accountName={senderAccount?.name ?? undefined}
          walletName={senderWallet ?? undefined}
        />
        <TextView color={'text.10'} fontFamily={'medium'} fontSize={18} mt={4}>
          {Facade.t('transactionDetails.recipient')}
        </TextView>
        <AccountView
          contactName={receiverName}
          address={receiverAddress ?? ''}
          accountName={receiverAccount?.name ?? undefined}
          walletName={receiverWallet ?? undefined}
        />
        <LinearLayout
          orientation={'verti'}
          borderRadius={'7px'}
          bg={'background.15'}
          pt={'12px'}
          pb={'12px'}
          pl={'16px'}
          pr={'16px'}
          mt={4}
        >
          <LinearLayout orientation={'horiz'}>
            <ImageView
              source={transaction.token?.srcIcon}
              width={'14px'}
              height={'14px'}
              alignSelf={'center'}
            />
            <TextView ml={'8px'} color={'text.0'} fontFamily={'medium'}>
              {transaction.token?.symbol}
            </TextView>
            <LinearLayout weight={1} />
            <TextView fontFamily={'medium'} color={'text.0'}>
              {Facade.filter.currency(
                (transaction.token?.exchangeToken(currency) ?? 1) /
                  (transaction.token?.amount ?? 1),
                currency,
                language
              )}
            </TextView>
            <TextView
              ml={2}
              fontFamily={'medium'}
              color={'text.10'}
              fontSize={'12px'}
              textAlignVertical={'bottom'}
              includeFontPadding={false}
              mt={1}
            >
              1 {transaction.token?.symbol}
            </TextView>
          </LinearLayout>
          <LinearLayout orientation={'horiz'}>
            <HeaderColumn
              weight={2}
              title={Facade.t('transactionDetails.qty')}
              value={transaction.token?.amount.toFixed(8) ?? ''}
            />
            <HeaderColumn
              weight={1.6}
              title={Facade.t('transactionDetails.value')}
              value={Facade.filter.currency(
                transaction.token?.exchangeToken(currency),
                currency,
                language
              )}
              valueTextColor={'primary'}
            />
          </LinearLayout>
        </LinearLayout>
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
