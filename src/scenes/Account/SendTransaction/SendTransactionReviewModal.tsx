import { Token } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import { TransactionTipCard } from '~/src/components/TransactionTipCard'
import { TransactionTokenCard } from '~/src/components/TransactionTokenCard'
import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useExchange } from '~/src/hooks/useExchange'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { Contact } from '~/src/store/contact/Contact'
import { Wallet } from '~/src/store/wallet/Wallet'
import { HeaderColumn } from '~src/components/HeaderColumn'
import { TransactionAccountCard } from '~src/components/TransactionAccountCard'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionReviewModalParams {
  amount: string
  fee: string
  account: Account
  wallet: Wallet
  token: Token
  destinationAddress: string
  fiat?: string
  tip?: string
  destinationAddressAlias?: string
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
    destinationAddressAlias,
    token,
    fee,
    tip,
  } = props.route.params

  const { authenticate } = useLocalAuthentication()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )

  const dispatch = useDispatch()
  const controller = useSwiperController(true)

  const { data: exchange } = useExchange()

  const amountNumber = Number(amount) + Number(tip ?? 0) + Number(fee)

  const currencyAmount = BalanceHelper.convertBalanceToCurrency(
    {
      amountNumber: Number(amount) + Number(tip ?? 0),
      amount: amountNumber.toString(),
      blockchain: account.blockchain,
      token,
    },
    exchange
  )
  const convertedAmount = currencyAmount?.convertedAmount ?? 0

  const ratio = useMemo(() => {
    if (!exchange) return

    return BalanceHelper.getExchangeRatio(token.hash, token.symbol, account.blockchain, exchange)
  }, [exchange, currency, token])

  const submit = async () => {
    if (!account.address) {
      return
    }

    const senderKey = await account.getKey()
    if (!senderKey) return

    try {
      await authenticate()
    } catch {
      return
    }

    const tipConfig = blockchainConfig.mainnetTipByBlockchain[account.blockchain]
    try {
      const transactionHash = await blockchainService.transfer({
        tipIntent:
          tip && tipConfig
            ? {
                amount: tip,
                receiverAddress: tipConfig.address,
                tokenHash: tipConfig.token.hash,
                tokenDecimals: tipConfig.token.decimals,
              }
            : undefined,
        senderAccount: {
          address: account.address,
          key: senderKey,
          type: 'wif',
        },
        intent: {
          amount,
          receiverAddress: destinationAddress,
          tokenHash: token.hash,
          tokenDecimals: token.decimals,
        },
      })

      account.addPendingTransaction({
        hash: transactionHash,
        block: 0,
        notifications: [],
        transfers: [
          {
            amount,
            type: 'token',
            contractHash: token.hash,
            from: account.address,
            to: destinationAddress,
            token,
          },
        ],
        fee,
      })

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
    } catch (error) {
      console.log(error)
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
                address={account.address}
                accountName={account.name}
                walletName={wallet.name}
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
                addressAlias={destinationAddressAlias}
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
