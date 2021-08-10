import {useNavigationState} from '@react-navigation/native'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useCallback, useEffect, useState} from 'react'
import {Alert, ScrollView, TouchableHighlight, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import * as LocalAuthentication from '~/node_modules/expo-local-authentication'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {AccountView} from '~src/components/AccountView'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import {TokenView, TipView} from '~src/components/TokenView'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
export interface SendTransactionReviewModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList & RootStackParamList>
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
  const contact = contacts.find((value) =>
    value.addresses.find(
      (address) => address === senderTransaction.receiverAddress
    )
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
  const {isConnected} = useSelector((state: RootState) => state.network)
  const {senderTransaction} = useSelector((state: RootState) => state)
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const tip = useSelector((state: RootState) => state.senderTransaction.tip)
  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<
    AsyncDispatch<string | null | undefined>
  >()
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)

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
    const contact = contacts.find((value) =>
      value.addresses.find(
        (address) => address === senderTransaction.senderAddress
      )
    )
    senderName = contact?.name ?? undefined
  }
  const receiverAccount = accounts.find(
    (account) => account.address === receiverAddress
  )

  if (receiverAccount) {
    receiverWallet = receiverAccount.getWallet(wallets)?.name
  } else {
    const contact = contacts.find((value) =>
      value.addresses.find(
        (address) => address === senderTransaction.receiverAddress
      )
    )
    receiverName = contact?.name ?? undefined
  }

  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.SendTransactionReviewModal.name
  )

  const checkForAuth = useCallback(async () => {
    // If user has set up authentication (either hardware or passcode)
    const hasAuth = await Storage.hasAuthentication.load()
    const useHardware = await Storage.hasAuthenticationForHardware.load()

    if (hasAuth === true) {
      // Checks if user set up a passcode
      const passcode = await Facade.security.loadPasscode()

      // If passcode, navigates to passcode confirmation screen
      if (passcode) {
        props.navigation.navigate(Facade.route.PasscodeStack.name, {
          screen: Facade.route.VerifyPasscode.name,
          params: {
            onValidate: (it) => {
              if (it) {
                Facade.await.run('submit', submit)
              }
            },
          },
        })
      } else {
        // If no passcode, hardware authentication
        await tryAuth()
      }
    } else if (useHardware) {
      await tryAuth()
    } else {
      Facade.await.run('submit', submit)
    }
  }, [])

  const tryAuth = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()

    if (canUseHardware) {
      const result = await LocalAuthentication.authenticateAsync()

      if (!result.success) {
        alertDialog()
      } else {
        Facade.await.run('submit', submit)
      }
    }
  }

  const alertDialog = () =>
    Alert.alert(
      Facade.t('modals.send.transactionReview.dialog.title'),
      Facade.t('modals.send.transactionReview.dialog.subtitle'),
      [
        {
          text: Facade.t('modals.send.transactionReview.dialog.confirm'),
          onPress: async () => await tryAuth,
        },
        {
          text: Facade.t('modals.send.transactionReview.dialog.cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: true}
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

  const calcValue = () => {
    const fiat = senderTransaction.fiat ?? 0
    const tip =
      exchange['GAS'].to[currency] * (senderTransaction.tip?.amount ?? 0)
    const fee =
      exchange['GAS'].to[currency] * (senderTransaction.feeAmount?.fee ?? 0)

    const value = fiat + tip + fee

    return Facade.filter.currency(value, currency, language)
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
        name={'auth'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <AwaitActivity
          name={'submit'}
          loadingView={<ScreenLoader transparent={true} />}
        >
          <View>
            <LinearLayout
              height="100%"
              width="100%"
              orientation="verti"
              alignItems="center"
              justifyContent="space-between"
            >
              <LinearLayout
                width="100%"
                orientation="verti"
                alignContent={'flex-start'}
              >
                <LinearLayout width="100%" alignItems="center">
                  <TextView
                    color="text.0"
                    fontFamily="medium"
                    fontSize="18px"
                    mb="18px"
                  >
                    {Facade.t('modals.send.transactionReview.pleaseReview')}
                  </TextView>
                  <LinearLayout orientation={'horiz'}>
                    <HeaderColumn
                      title={Facade.t(
                        'modals.send.transactionReview.value'
                      ).toUpperCase()}
                      value={calcValue()}
                      weight={2}
                    />
                    <HeaderColumn
                      title={Facade.t(
                        'modals.send.transactionReview.priorityFee'
                      ).toUpperCase()}
                      value={
                        senderTransaction.feeAmount?.fee
                          ? `${senderTransaction.feeAmount?.fee} GAS`
                          : ''
                      }
                      weight={1.2}
                      priorityFee={senderTransaction.feeAmount ?? undefined}
                    />
                  </LinearLayout>
                </LinearLayout>

                <LinearLayout orientation={'horiz'} alignContent={'flex-start'}>
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
                    {Facade.t('modals.send.transactionReview.sender')}
                  </TextView>
                </LinearLayout>
                <LinearLayout width={'100%'}>
                  <AccountView
                    contactName={senderName}
                    address={senderAddress ?? ''}
                    accountName={senderAccount?.name ?? undefined}
                    walletName={senderWallet ?? undefined}
                    hideButton={true}
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
                      {Facade.t('modals.send.transactionReview.recipient')}
                    </TextView>
                  </LinearLayout>
                  <AccountView
                    contactName={receiverName}
                    address={receiverAddress ?? ''}
                    accountName={receiverAccount?.name ?? undefined}
                    walletName={receiverWallet ?? undefined}
                  />
                  <TokenView
                    transaction={senderTransaction}
                    hideSingleTokenPrice={true}
                    widthIcon="20px"
                    heightIcon="20px"
                    hideAmountAbove={true}
                    hideTokenInWallet={true}
                    hidePriorityFee={true}
                  />
                  {tip && <TipView amount={tip.amount} />}
                </LinearLayout>
              </LinearLayout>

              <LinearLayout width="90%" mt="32px" alignSelf="center">
                <ThemedButton
                  label={Facade.t('app.send')}
                  onPress={() => Facade.await.run('auth', checkForAuth)}
                  rounded={true}
                  radius={8}
                  disabled={!isConnected}
                />
              </LinearLayout>
            </LinearLayout>
          </View>
        </AwaitActivity>
      </AwaitActivity>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendTransactionReviewModal
