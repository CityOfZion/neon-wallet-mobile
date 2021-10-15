import {useNavigationState} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useCallback} from 'react'
import {Alert, ScrollView, View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {useHeaderHeight} from '~/node_modules/@react-navigation/stack'
import * as LocalAuthentication from '~/node_modules/expo-local-authentication'
import {wrapper} from '~/src/app/ApplicationWrapper'
import {Normalize} from '~/src/app/Normalize'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {SecurityHelper} from '~/src/helpers/SecurityHelper'
import {Storage} from '~src/app/Storage'
import {AccountView} from '~src/components/AccountView'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import {TokenView, TipView} from '~src/components/TokenView'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
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
        ({address}) => address === senderTransaction.senderAddress
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
        ({address}) => address === senderTransaction.receiverAddress
      )
    )
    receiverName = contact?.name ?? undefined
  }

  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      wrapper.route.SendTransactionReviewModal.name
  )

  const checkForAuth = useCallback(async () => {
    // If user has set up authentication (either hardware or passcode)
    const hasAuth = await Storage.hasAuthentication.load()
    const useHardware = await Storage.hasAuthenticationForHardware.load()

    if (hasAuth === true) {
      // Checks if user set up a passcode
      const passcode = await SecurityHelper.loadPasscode()

      // If passcode, navigates to passcode confirmation screen
      if (passcode) {
        props.navigation.navigate(wrapper.route.PasscodeStack.name, {
          screen: wrapper.route.VerifyPasscode.name,
          params: {
            onValidate: (it) => {
              if (it) {
                Await.run('submit', submit)
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
      Await.run('submit', submit)
    }
  }, [])

  const tryAuth = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()

    if (canUseHardware) {
      const result = await LocalAuthentication.authenticateAsync()

      if (!result.success) {
        alertDialog()
      } else {
        Await.run('submit', submit)
      }
    }
  }

  const alertDialog = () =>
    Alert.alert(
      i18n.t('modals.send.transactionReview.dialog.title'),
      i18n.t('modals.send.transactionReview.dialog.subtitle'),
      [
        {
          text: i18n.t('modals.send.transactionReview.dialog.confirm'),
          onPress: async () => await tryAuth,
        },
        {
          text: i18n.t('modals.send.transactionReview.dialog.cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: true}
    )

  const submit = async () => {
    let transactionHash: string | null | undefined
    const account = accounts.find(
      (it) => it.address === senderTransaction.senderAddress
    )

    if (account) {
      transactionHash = await dispatchAsyncString(
        RootStore.senderTransaction.actions.sendAsset(account)
      )

      if (!transactionHash) {
        showMessage({message: 'Transaction has failed', type: 'danger'})
        throw new Error('Transaction has failed')
      }
      await account.addPendingTransaction(senderTransaction, transactionHash)
      await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    }

    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: wrapper.route.SendTransactionConfirmationModal.name,
          params: {transactionHash},
        },
      ],
    })
  }

  const calcValue = () => {
    const fiat = senderTransaction.fiat ?? 0
    const tip = senderTransaction.tip ? senderTransaction.tip.amount : 0
    const fee = senderTransaction.feeAmount
      ? senderTransaction.feeAmount.fee
      : 0

    const value = fiat + tip + fee

    return FilterHelper.currency(value, currency, language)
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
                    {i18n.t('modals.send.transactionReview.pleaseReview')}
                  </TextView>
                  <LinearLayout orientation={'horiz'}>
                    <HeaderColumn
                      title={i18n
                        .t('modals.send.transactionReview.value')
                        .toUpperCase()}
                      value={calcValue()}
                      weight={2}
                    />
                    <HeaderColumn
                      title={i18n
                        .t('modals.send.transactionReview.priorityFee', {
                          tokenSymbol: senderTransaction.token?.symbol,
                        })
                        .toUpperCase()}
                      value={
                        senderTransaction.feeAmount?.fee
                          ? `${senderTransaction.feeAmount?.fee}`
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
                      width={Normalize.scale(18)}
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
                    {i18n.t('modals.send.transactionReview.sender')}
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
                        width={Normalize.scale(18)}
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
                      {i18n.t('modals.send.transactionReview.recipient')}
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
                  label={i18n.t('app.send')}
                  onPress={() => Await.run('auth', checkForAuth)}
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
