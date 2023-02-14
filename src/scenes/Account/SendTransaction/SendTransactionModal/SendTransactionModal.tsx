import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import { TouchableHighlight } from 'react-native'
import InputScrollView from 'react-native-input-scroll-view'
import { useSelector } from 'react-redux'

import { AmountInput } from './AmountInput'
import { DestinationInput } from './DestinationInput'
import { FeePriorityTab } from './FeePriorityTab'
import { TipCheckbox } from './TipCheckbox'
import { TokenSelect } from './TokenSelect'
import { TotalFee } from './TotalFee'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainServices } from '~/src/blockchain'
import AccountCard from '~/src/components/AccountCard'
import SwiperPanel, { PANEL_OFFSET, useSwiperController } from '~/src/components/SwiperPanel'
import ThemedButton from '~/src/components/themed/ThemedButton'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { Token } from '~/src/models/Token'
import { Account } from '~/src/models/redux/Account'
import { Contact } from '~/src/models/redux/Contact'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export interface SendTransactionModalParams {
  account: Account
  wallet: Wallet
  token?: Token
  address?: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionModal'>
}

export const SendTransactionModal = (props: Props) => {
  const { account, wallet, token: initialToken, address: initialAddress } = props.route.params

  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const controller = useSwiperController(true)

  const balanceExchange = useBalancesAndExchange(account)

  const [destinationAddress, setDestinationAdress] = useState<string | undefined>(initialAddress)
  const [destinationAddressIsValid, setDestinationAddressIsValid] = useState<boolean>()
  const [destinationAccount, setDestinationAccount] = useState<Account>()
  const [destinationWallet, setDestinationWallet] = useState<Wallet>()
  const [destinationContact, setDestinationContact] = useState<Contact>()

  const [token, setToken] = useState<Token | undefined>(initialToken)
  const [amount, setAmount] = useState<string>()
  const [fiat, setFiat] = useState<string>()
  const [amountIsValid, setAmountIsValid] = useState<boolean>()

  const [fee, setFee] = useState<number>()
  const [isRequestingFee, setIsRequestFee] = useState(false)

  const [tip, setTip] = useState<number>()
  const [tipIsChecked, setTipIsChecked] = useState<boolean>(true)
  const [tipIsDisabled, setTipIsDisabled] = useState<boolean>(false)

  const feeTokenBalance = useMemo(
    () =>
      BalanceHelper.getTokenBalanceBySymbol(
        blockchainServices[account.blockchain].feeToken.token,
        balanceExchange.balance.data
      ),
    [balanceExchange, account]
  )
  const tokenBalance = useMemo(() => {
    if (!token) return

    return BalanceHelper.getTokenBalanceBySymbol(token.symbol, balanceExchange.balance.data)
  }, [balanceExchange, token])

  const ratio = useMemo(() => {
    if (!token) return

    return BalanceHelper.getExchangeRatio(token.symbol, token.blockchain, balanceExchange.exchange.data)
  }, [balanceExchange, currency])

  const handleSelectToken = (token: Token) => {
    setToken(token)
    setAmount(undefined)
    setFiat(undefined)
  }

  const validateField = () => {
    return (
      destinationAddress &&
      destinationAddressIsValid &&
      token &&
      amount &&
      amountIsValid &&
      fee !== undefined &&
      !isRequestingFee
    )
  }

  const submit = () => {
    if (!validateField) {
      return
    }

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionReviewModal.name,
      params: {
        amount,
        fiat,
        fee,
        account,
        wallet,
        token,
        destinationAddress,
        tip: !tipIsDisabled && tipIsChecked ? tip : undefined,
        destinationAccount,
        destinationWallet,
        destinationContact,
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.sendTransactionModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      disableDefaultScrollView
      solidColorBG
    >
      <InputScrollView
        keyboardOffset={300}
        showsVerticalScrollIndicator={false}
        disableScrollViewPanResponder
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{
          paddingBottom: PANEL_OFFSET + 20,
        }}
      >
        <TouchableHighlight>
          <LinearLayout>
            <LinearLayout orientation="verti">
              <TextView mb="24px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
                {wallet.name}
              </TextView>

              <AccountCard hideBalance={false} balanceExchange={balanceExchange} account={account} />

              <TextView mt="40px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
                {i18n.t('modals.sendTransactionModal.transactionDetails')}
              </TextView>

              <DestinationInput
                onAddressChange={setDestinationAdress}
                onAccountChange={setDestinationAccount}
                onContactChange={setDestinationContact}
                onWalletChange={setDestinationWallet}
                onAddressValidation={setDestinationAddressIsValid}
                account={account}
                destinationAddress={destinationAddress}
                destinationAccount={destinationAccount}
                destinationContact={destinationContact}
                destinationWallet={destinationWallet}
              />

              <TokenSelect account={account} token={token} onTokenSelect={handleSelectToken} />

              <AmountInput
                account={account}
                ratio={ratio}
                token={token}
                onAmountChange={setAmount}
                onFiatChange={setFiat}
                amount={amount}
                fiat={fiat}
                onAmountValidation={setAmountIsValid}
                tokenBalance={tokenBalance}
                feeTokenBalance={feeTokenBalance}
                fee={fee}
              />

              {account.blockchain === 'neoLegacy' && <FeePriorityTab onFeeChange={setFee} account={account} />}

              {account.blockchain === 'neo3' && (
                <TotalFee
                  ratio={ratio}
                  account={account}
                  amount={amount ? Number(amount) : undefined}
                  tip={!tipIsDisabled && tipIsChecked ? tip : undefined}
                  fee={fee}
                  destinationAddress={destinationAddress}
                  destinationAddressIsValid={destinationAddressIsValid}
                  token={token}
                  feeTokenBalance={feeTokenBalance}
                  onFeeChange={setFee}
                  onRequest={setIsRequestFee}
                />
              )}

              <TipCheckbox
                account={account}
                amount={Number(amount)}
                token={token}
                fee={fee}
                tip={tip}
                disabled={tipIsDisabled}
                checked={tipIsChecked}
                onTipChange={setTip}
                onCheckChange={setTipIsChecked}
                onDisableChange={setTipIsDisabled}
                tokenBalance={tokenBalance}
              />
            </LinearLayout>
            <LinearLayout mt={30} mb={20} alignSelf="center" width="100%">
              <ThemedButton label={i18n.t('app.next')} onPress={submit} disabled={!validateField() || !isConnected} />
            </LinearLayout>
          </LinearLayout>
        </TouchableHighlight>
      </InputScrollView>
    </SwiperPanel>
  )
}
