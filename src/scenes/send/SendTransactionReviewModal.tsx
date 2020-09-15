import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import {plainToClass} from 'class-transformer'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
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
  const controller = useSwiperController(true)

  const {senderTransaction} = useSelector((state: RootState) => state)
  const {accounts} = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch<SyncDispatch>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string | null>>()

  const submit = async () => {
    const transactionHash = await dispatchAsyncString(
      RootStore.senderTransaction.actions.sendAsset()
    )

    if (!transactionHash) {
      throw new Error('Transaction has failed')
    }

    await saveToHistory(transactionHash)

    dispatch(RootStore.senderTransaction.actions.clearState())

    props.navigation.navigate(Facade.route.Modal.name, {
      screen: Facade.route.SendTransactionConfirmationModal.name,
      params: {transactionHash},
    })
  }

  const saveToHistory = async (transactionHash: string) => {
    const senderTx = plainToClass(SenderTransaction, senderTransaction)
    senderTx.sentAt = Facade.moment().format()
    senderTx.transactionHash = transactionHash
    senderTx.isPending = true
    senderTx.token = senderTransaction.token
    await senderTx.populateExchange()

    const account = accounts.find((it) => it.address === senderTx.senderAddress)
    if (account) {
      const senderTxs = account.pendingTransactions.flatMap(
        (it) => it.transactions
      )
      senderTxs.push(senderTx)

      account.pendingTransactions = TransactionDateGroup.toTransactionDateGroup(
        senderTxs
      )

      await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    }
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={Facade.t('modals.send.title')}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <AwaitActivity
        name={'submit'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout
          height="100%"
          width="100%"
          px="15px"
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

          <TransactionSummaryContainer />

          <LinearLayout width="100%" mt="32px">
            <ThemedButton
              label={Facade.t('app.send')}
              onPress={() => Facade.await.run('submit', submit)}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default SendTransactionReviewModal
