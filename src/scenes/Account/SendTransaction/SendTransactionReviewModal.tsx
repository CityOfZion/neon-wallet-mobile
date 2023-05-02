import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import React, { useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import { TransactionTipCard } from '~/src/components/TransactionTipCard'
import { TransactionTokenCard } from '~/src/components/TransactionTokenCard'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { useExchange } from '~/src/hooks/useExchange'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { Token } from '~/src/models/Token'
import { Account, PendingTransactions } from '~/src/models/redux/Account'
import { Contact } from '~/src/models/redux/Contact'
import { Wallet } from '~/src/models/redux/Wallet'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { HeaderColumn } from '~src/components/HeaderColumn'
import { TransactionAccountCard } from '~src/components/TransactionAccountCard'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionReviewModalParams {
  amount: string
  fee: number
  account: Account
  wallet: Wallet
  token: Token
  destinationAddress: string
  fiat?: string
  tip?: number
  destinationAccount?: Account
  destinationWallet?: Wallet
  destinationContact?: Contact
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionReviewModal'>
}

export const SendTransactionReviewModal = (props: Props) => {
  const {
    account,
    amount,
    fiat,
    destinationAddress,
    wallet,
    destinationAccount,
    destinationContact,
    destinationWallet,
    token,
    fee,
    tip,
  } = props.route.params

  const { authenticate } = useLocalAuthentication()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const { blockchainService } = useBlockchainService(account.blockchain)
  const { data: exchange } = useExchange()

  const currencyAmount = BalanceHelper.convertBalanceToCurrency(
    { amount: Number(amount) + fee + (tip ?? 0), ...token },
    exchange
  )
  const convertedAmount = currencyAmount?.convertedAmount ?? 0

  const ratio = useMemo(() => {
    if (!exchange) return

    return BalanceHelper.getExchangeRatio(token.symbol, token.blockchain, exchange)
  }, [exchange, currency, token])

  const submit = async () => {
    if (!account.address) {
      return
    }

    const wif = await account.getWif()
    if (!wif) return

    try {
      await authenticate()
    } catch {
      return
    }

    try {
      const transactionHash = await blockchainService.sendTransaction({
        receiverAddress: destinationAddress,
        senderWif: wif,
        tokenHash: token.hash,
        tokenDecimals: token.decimals,
        amount: Number(amount),
        fee,
        tip,
      })

      if (!transactionHash) {
        throw new Error(i18n.t('modals.sendTransactionReviewModal.transactionFailed'))
      }

      const pendingTransaction: PendingTransactions = {
        hash: transactionHash,
        senderAddress: account.address,
        receiverAddress: destinationAddress,
        token,
        amount: Number(amount),
        fee,
        time: moment().unix(),
      }

      account.pendingTransactions = [...account.pendingTransactions, pendingTransaction]
      dispatch(accountReducerActions.saveAccount(account))
      dispatch(accountReducerActions.watchPendingTransaction({ account, transactionHash, isClaim: false }))

      props.navigation.popToTop()
      props.navigation.goBack()
      props.navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.SendTransactionConfirmationModal.name,
        params: {
          transactionHash,
        },
      })
    } catch {
      showMessage({
        message: i18n.t('modals.sendTransactionReviewModal.transactionFailed'),
        type: 'danger',
      })
    }
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.sendTransactionReviewModal.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
    >
      <AwaitActivity name="submit" loadingView={<ScreenLoader transparent />}>
        <LinearLayout height="100%" width="100%" orientation="verti" alignItems="center" justifyContent="space-between">
          <LinearLayout width="100%" orientation="verti" alignContent="flex-start">
            <LinearLayout width="100%" alignItems="center">
              <TextView color="text.0" fontFamily="medium" fontSize="18px" mb="18px">
                {i18n.t('modals.sendTransactionReviewModal.pleaseReview')}
              </TextView>
              <LinearLayout orientation="horiz">
                <HeaderColumn
                  title={i18n.t('modals.sendTransactionReviewModal.value').toUpperCase()}
                  value={FilterHelper.currency(convertedAmount, currency, language)}
                  weight={2}
                />
                {}
                <HeaderColumn
                  title={i18n
                    .t('modals.sendTransactionReviewModal.fee', {
                      tokenSymbol: token.symbol,
                    })
                    .toUpperCase()}
                  value={`${fee} GAS`}
                  weight={1.2}
                />
              </LinearLayout>
            </LinearLayout>

            <LinearLayout orientation="horiz" alignContent="flex-start">
              <LinearLayout mr={2} mt={5} alignSelf="center">
                <ImageView
                  width={Normalize.scale(18)}
                  resizeMode="contain"
                  source={require('~src/assets/images/arrow-gray.png')}
                />
              </LinearLayout>
              <TextView color="text.10" fontFamily="medium" fontSize={18} mt={4}>
                {i18n.t('modals.sendTransactionReviewModal.sender')}
              </TextView>
            </LinearLayout>
            <LinearLayout width="100%">
              <TransactionAccountCard
                address={account.address ?? undefined}
                accountName={account.name ?? undefined}
                walletName={wallet.name ?? undefined}
                hideButton
              />
              <LinearLayout orientation="horiz">
                <LinearLayout mr={2} mt={5} alignSelf="center">
                  <ImageView
                    width={Normalize.scale(18)}
                    resizeMode="contain"
                    source={require('~src/assets/images/arrow-receive-gray.png')}
                  />
                </LinearLayout>
                <TextView color="text.10" fontFamily="medium" fontSize={18} mt={4}>
                  {i18n.t('modals.sendTransactionReviewModal.recipient')}
                </TextView>
              </LinearLayout>
              <TransactionAccountCard
                contactName={destinationContact?.name ?? undefined}
                address={destinationAddress}
                accountName={destinationAccount?.name ?? undefined}
                walletName={destinationWallet?.name ?? undefined}
              />
              <TransactionTokenCard
                account={account}
                amount={amount}
                fee={fee}
                fiat={fiat}
                token={token}
                hideSingleTokenPrice
                hideFee
                ratio={ratio}
              />
              {tip && <TransactionTipCard account={account} tip={tip} />}
            </LinearLayout>
          </LinearLayout>

          <LinearLayout width="90%" mt="32px" alignSelf="center">
            <ThemedButton
              label={i18n.t('app.send')}
              onPress={() => Await.run('submit', submit)}
              disabled={!isConnected}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
