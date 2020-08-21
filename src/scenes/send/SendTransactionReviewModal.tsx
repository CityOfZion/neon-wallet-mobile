import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {TokenAsset} from '~src/models/TokenAsset'
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
  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)
  const {contacts} = useSelector((state: RootState) => state.app)
  const transactionState = useSelector(
    (state: RootState) => state.senderTransaction
  )

  const singleToken = new TokenAsset(
    transactionState.token?.name ?? '',
    transactionState.token?.symbol ?? '',
    transactionState.token?.hash ?? ''
  )
  singleToken.amount = 1
  const singleTokenPrice = singleToken.exchange(currency, exchange)
  const contact = contacts.find(
    (value) => value.address === transactionState.receiverAddress
  )

  const accountTokenAmount =
    transactionState.account?.getBalanceAmountByAsset(
      transactionState.token?.symbol ?? ''
    ) ?? 0

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
        {transactionState.receiverAddress}
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
          source={transactionState.token?.srcIcon}
          width={18}
          height={18}
          resizeMode="contain"
        />
        <TextView color="text.0" fontFamily="semibold" fontSize="18px">
          {transactionState.token?.symbol}
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
          {transactionState.token?.amount}
        </TextView>
        <TextView color="text.6" fontFamily="semibold" fontSize="12px">
          {Facade.t('modals.send.transactionReview.remainingInWallet', {
            token: `${accountTokenAmount} ${transactionState.token?.symbol}`,
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
            transactionState.token?.exchange(currency, exchange),
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

      {transactionState.feeAmount && (
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
            {transactionState.feeAmount.name.toUpperCase()}
          </TextView>
          <TextView color="text.0" fontSize="18px">
            {Facade.t('modals.send.transactionReview.feeAmount', {
              amount: `${transactionState.feeAmount.fee ?? 0} GAS`,
            })}
          </TextView>
        </LinearLayout>
      )}
    </LinearLayout>
  )
}

const SendTransactionReviewModal = (props: Props) => {
  const controller = useSwiperController(true)

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

    await dispatchAsync(
      RootStore.senderTransaction.actions.saveToHistory(transactionHash)
    )
    await dispatchAsync(RootStore.app.actions.syncPendingTransactions())

    dispatch(RootStore.senderTransaction.actions.clearState())

    props.navigation.navigate(Facade.route.Modal.name, {
      screen: Facade.route.SendTransactionConfirmationModal.name,
      params: {transactionHash},
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={Facade.t('modals.send.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
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
