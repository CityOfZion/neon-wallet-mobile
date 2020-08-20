import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React from 'react'
import {useDispatch} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {Priority} from '~src/scenes/send/SendTransactionInputModal'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
}

const TransactionSummaryContainer = () => {
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
      <TextView color="text.0" fontSize="18px" fontFamily="medium">
        Tyler A
      </TextView>
      <TextView color="primary" fontSize="18px" fontFamily="medium">
        a0x9EbitG5amU0C4wHjgWUhwWL
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
          source={require('~src/assets/logos/logo-neo.png')}
        />
        <TextView color="text.0" fontFamily="semibold" fontSize="18px">
          NEO
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
          28.20028234
        </TextView>
        <TextView color="text.6" fontFamily="semibold" fontSize="12px">
          {Facade.t('modals.send.transactionReview.remainingInWallet', {
            token: '35 NEO',
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
          $1231235,00
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
          $12,01
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
          {Facade.t('modals.send.transactionReview.priority')}
        </TextView>
        <TextView
          color="primary"
          fontFamily="semibold"
          fontSize="18px"
          mr="8px"
        >
          {Priority[Priority.FAST]}
        </TextView>
        <TextView color="text.0" fontSize="18px">
          {Facade.t('modals.send.transactionReview.feeAmount', {
            amount: '0.0000001 GAS',
          })}
        </TextView>
      </LinearLayout>
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
