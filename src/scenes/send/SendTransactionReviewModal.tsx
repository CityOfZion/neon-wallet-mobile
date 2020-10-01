import {useNavigationState} from '@react-navigation/native'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import {plainToClass} from 'class-transformer'
import React, {useEffect, useState} from 'react'
import {ScrollView, TouchableHighlight} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {AccountView} from '~src/components/AccountView'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import {TokenView} from '~src/components/TokenView'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendTransactionReviewModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList>
}

const TransactionSummaryContainer = () => {
  const {exchange, contacts, accounts} = useSelector(
    (state: RootState) => state.app
  )
  const {currency} = useSelector((state: RootState) => state.settings)
  const {senderTransaction} = useSelector((state: RootState) => state)
  const [account, setAccount] = useState<Account>()

  const singleToken = new TokenAsset(
    senderTransaction.token?.name ?? '',
    senderTransaction.token?.symbol ?? '',
    senderTransaction.token?.hash ?? ''
  )
  singleToken.amount = 1
  const singleTokenPrice = singleToken.exchangeToken(currency, exchange)
  const contact = contacts.find(
    (value) => value.address === senderTransaction.receiverAddress
  )

  useEffect(() => {
    const account = accounts.find(
      (it) => it.address === senderTransaction.senderAddress
    )
    setAccount(account)
  }, [])

  const getTokenAmount = () => {
    return (
      account?.getBalanceAmountByAsset(senderTransaction.token?.symbol ?? '') ??
      0
    )
  }

  return (
    <LinearLayout
      orientation="verti"
      borderRadius="8px"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="background.4"
      width="100%"
      px="14px"
      py="20px"
    >
      {contact && (
        <TextView color="text.0" fontSize="18px" fontFamily="medium">
          {contact.name}
        </TextView>
      )}
      <TextView color="primary" fontSize="18px" fontFamily="medium">
        {senderTransaction.receiverAddress}
      </TextView>
      <LinearLayout mt="18px" mb="22px" orientation="horiz" alignItems="center">
        <TextView
          color="text.6"
          width="60px"
          mr="12px"
          fontFamily="medium"
          fontSize="14px"
        >
          {Facade.t('modals.send.transactionReview.token')}
        </TextView>
        <ImageView
          mr="4px"
          source={senderTransaction.token?.srcIcon}
          width={18}
          height={18}
          resizeMode="contain"
        />
        <TextView color="text.0" fontFamily="semibold" fontSize="18px">
          {senderTransaction.token?.symbol}
        </TextView>
      </LinearLayout>
      <LinearLayout mb="22px" orientation="horiz" alignItems="center">
        <TextView
          color="text.6"
          width="60px"
          mr="12px"
          fontFamily="medium"
          fontSize="14px"
        >
          {Facade.t('modals.send.transactionReview.amount')}
        </TextView>
        <TextView color="text.0" fontFamily="semibold" fontSize="18px" mr="6px">
          {senderTransaction.token?.amount}
        </TextView>
        <TextView color="text.6" fontFamily="semibold" fontSize="12px">
          {Facade.t('modals.send.transactionReview.remainingInWallet', {
            token: `${getTokenAmount()} ${senderTransaction.token?.symbol}`,
          })}
        </TextView>
      </LinearLayout>
      <LinearLayout mb="22px" orientation="horiz" alignItems="center">
        <TextView
          color="text.6"
          width="60px"
          mr="12px"
          fontFamily="medium"
          fontSize="14px"
        >
          {Facade.t('modals.send.transactionReview.value')}
        </TextView>
        <TextView color="text.0" fontFamily="semibold" fontSize="18px">
          {Facade.filter.currency(
            senderTransaction.token?.exchangeToken(currency, exchange),
            currency
          )}
        </TextView>
      </LinearLayout>
      <LinearLayout mb="22px" orientation="horiz" alignItems="center">
        <TextView
          color="text.6"
          width="60px"
          mr="12px"
          fontFamily="medium"
          fontSize="14px"
        >
          {Facade.t('modals.send.transactionReview.price')}
        </TextView>
        <TextView color="text.0" fontFamily="semibold" fontSize="18px">
          {Facade.filter.currency(singleTokenPrice, currency)}
        </TextView>
      </LinearLayout>

      {senderTransaction.feeAmount && (
        <LinearLayout mb="22px" orientation="horiz" alignItems="center">
          <TextView
            color="text.6"
            width="60px"
            mr="12px"
            fontFamily="medium"
            fontSize="14px"
          >
            {Facade.t('modals.send.transactionReview.priority')}
          </TextView>
          <TextView
            color="primary"
            fontFamily="semibold"
            fontSize="18px"
            mr="8px"
          >
            {senderTransaction.feeAmount.name.toUpperCase()}
          </TextView>
          <TextView color="text.0" fontSize="18px">
            {Facade.t('modals.send.transactionReview.feeAmount', {
              amount: `${senderTransaction.feeAmount.fee ?? 0} GAS`,
            })}
          </TextView>
        </LinearLayout>
      )}
    </LinearLayout>
  )
}

const SendTransactionReviewModal = (props: Props) => {
  const {senderTransaction} = useSelector((state: RootState) => state)
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string | null>>()
  const {currency, language} = useSelector((state: RootState) => state.settings)

  let senderName = undefined
  const senderAddress = senderTransaction.senderAddress ?? undefined

  let senderWallet = undefined
  let receiverWallet = undefined

  let receiverName = undefined
  const receiverAddress = senderTransaction.receiverAddress ?? undefined

  const senderAccount = accounts.find(
    (account) => account.address === senderAddress
  )
  if (senderAccount) {
    senderWallet = senderAccount.getWallet(wallets)?.name
  } else {
    const contact = contacts.find(
      (value) => value.address === senderTransaction.senderAddress
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
      (value) => value.address === senderTransaction.receiverAddress
    )
    receiverName = contact?.name ?? undefined
  }

  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.SendTransactionReviewModal.name
  )

  const submit = async () => {
    const transactionHash = await dispatchAsyncString(
      RootStore.senderTransaction.actions.sendAsset()
    )

    if (!transactionHash) {
      throw new Error('Transaction has failed')
    }

    const account = accounts.find(
      (it) => it.address === senderTransaction.senderAddress
    )

    if (account) {
      await account.addPendingTransaction(senderTransaction, transactionHash)
      await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    }

    dispatch(RootStore.senderTransaction.actions.clearState())

    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: Facade.route.SendTransactionConfirmationModal.name,
          params: {transactionHash},
        },
      ],
    })
  }

  return show ? (
    <ScrollView
      style={{
        width: '100%',
        marginTop: useHeaderHeight(),
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: PANEL_OFFSET + 20,
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      <AwaitActivity
        name={'submit'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <TouchableHighlight>
          <LinearLayout
            height="100%"
            width="100%"
            orientation="verti"
            alignItems="center"
          >
            <TextView
              color="text.0"
              fontFamily="medium"
              fontSize="18px"
              mb="48px"
            >
              {Facade.t('modals.send.transactionReview.pleaseReview')}
            </TextView>

            <LinearLayout width={'100%'}>
              <LinearLayout orientation={'horiz'}>
                <HeaderColumn
                  weight={1}
                  title={'Value'.toUpperCase()}
                  value={Facade.filter.currency(
                    senderTransaction.token?.exchangeToken(currency),
                    currency,
                    language
                  )}
                />
                <HeaderColumn
                  title={Facade.t(
                    'transactionDetails.priorityFee'
                  ).toUpperCase()}
                  value={`${senderTransaction.feeAmount?.fee ?? 0} GAS`}
                  weight={1}
                  priorityFee={senderTransaction.feeAmount ?? undefined}
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
              <AccountView
                contactName={senderName}
                address={senderAddress ?? ''}
                accountName={senderAccount?.name ?? undefined}
                walletName={senderWallet ?? undefined}
              />
              <TextView
                color={'text.10'}
                fontFamily={'medium'}
                fontSize={18}
                mt={4}
              >
                {Facade.t('transactionDetails.recipient')}
              </TextView>
              <AccountView
                contactName={receiverName}
                address={receiverAddress ?? ''}
                accountName={receiverAccount?.name ?? undefined}
                walletName={receiverWallet ?? undefined}
              />
              <TokenView
                transaction={senderTransaction}
                hideSingleTokenPrice={true}
              />
            </LinearLayout>

            <LinearLayout width="100%" mt="32px">
              <ThemedButton
                label={Facade.t('app.send')}
                onPress={() => Facade.await.run('submit', submit)}
              />
            </LinearLayout>
          </LinearLayout>
        </TouchableHighlight>
      </AwaitActivity>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendTransactionReviewModal
