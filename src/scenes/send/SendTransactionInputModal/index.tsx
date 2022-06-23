import { RouteProp, useNavigationState } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/stack'
import I18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import InputScrollView from 'react-native-input-scroll-view'
import { useDispatch, useSelector } from 'react-redux'

import AmountField from './AmountField'
import DestinationAddressField from './DestinationAddressField'
import PriorityTab from './PriorityTab'
import TokenField from './TokenField'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { TransactionFeeNeo3 } from '~/src/components/TransactionFeeNeo3'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { blockchainServices } from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import { PANEL_OFFSET } from '~src/components/SwiperPanel'
import { TipCheckbox } from '~src/components/TipCheckbox'
import ThemedButton from '~src/components/themed/ThemedButton'
import { IURI } from '~src/helpers/UriHelper'
import { CustomPriotity, FastPriority, NoPriority, PriorityFee } from '~src/models/PriorityFee'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { SendModalStackParamList } from '~src/navigation/SendModalStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionInputModalParams {
  walletTitle: string
  account: Account
  uri?: IURI
  selectedToken?: TokenAsset
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & SendModalStackParamList & WalletStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendTransactionInputModal'>
}

const SendTransactionInputModal = (prop: Props) => {
  const { account, walletTitle, uri, selectedToken } = prop.route.params
  const cozTip = blockchainServices[account.blockchain].cozTip
  const { contacts, tokens, accounts, wallets, exchange } = useSelector((state: RootState) => state.app)
  const headerHeight = useHeaderHeight()
  const [fieldTyping, setFieldTyping] = useState<string>(uri ? 'amountField' : '')
  const { currency } = useSelector((state: RootState) => state.settings)
  const [isValidTransaction, setIsValidTransaction] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState(prop.route.params?.uri?.address ?? '')
  const [amount, setAmount] = useState<number | string>(Number(uri?.amount) ?? '')
  const [fiat, setFiat] = useState<number | string>('')
  const [tip, setTip] = useState<{ amount: number; address: string }>()
  const [tokenTipAmount, setTokenTipAmount] = useState<number>(0)
  const hash = prop.route.params?.uri?.tokenHash ?? ''
  const tokenFromUri = Boolean(prop.route.params?.uri?.tokenHash)
  const [contact, setContact] = useState<Contact>()
  const [token, setToken] = useState<TokenAsset | null | undefined>(
    tokens.find(t => t.hash === hash) ??
      (selectedToken ? tokens.find((t: TokenAsset) => t.hash === selectedToken.hash) : null)
  )
  const [priority, setPriority] = useState<PriorityFee>(FastPriority())

  const dispatch = useDispatch<DispatchResult>()

  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const show = useNavigationState(
    state => state.routes[state.routes.length - 1].name === wrapper.route.SendTransactionInputModal.name
  )

  useEffect(() => {
    if (fieldTyping === 'amountField') {
      if (amount !== '') {
        if (token?.symbol) {
          const ratio = exchange[account.blockchain][token?.symbol]?.to[currency] ?? null
          if (ratio) {
            let valAmount = String(ratio * Number(amount))
            valAmount = valAmount.replace(/[\d.]+e-[0-9]+/g, String(0))
            valAmount = valAmount.replace(/[0-9]+\.[0-9]{3,}$/g, String(Number(valAmount).toFixed(2)))
            setFiat(Number(valAmount))
          }
        }
      } else setFiat('')
    }
  }, [amount])

  useEffect(() => {
    if (fieldTyping === 'fiatField') {
      if (fiat !== '') {
        if (token?.symbol) {
          const ratio = exchange[account.blockchain][token?.symbol]?.to[currency] ?? null
          if (ratio) {
            let val = String(Number(fiat) / ratio)
            val = val.replace(/[0-9]+\.[0-9]{9,}$/g, String(Number(val).toFixed(token.decimals ?? 8)))
            setAmount(Number(val))
          }
        }
      } else setAmount('')
    }
  }, [fiat])

  useEffect(() => {
    if (!uri?.amount) {
      setAmount('')
    }
  }, [token])

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  useEffect(() => {
    const amount =
      account.tokenAssets.find(asset => asset.name === cozTip?.token && asset.symbol === cozTip.token)?.amount ?? 0
    setTokenTipAmount(amount)
  }, [cozTip, account])

  const changePriority = useCallback(
    (newPriority: PriorityFee) => {
      if (priority.equals(newPriority)) {
        setPriority(NoPriority)
      } else {
        setPriority(newPriority)
      }
    },
    [priority]
  )

  const submit = useCallback(() => {
    const senderAddress = account.address
    if (!token) {
      throw new Error('Token was not defined')
    } else if (!senderAddress) {
      throw new Error('Sender address was not defined')
    } else if (!amount) {
      throw new Error('Amount was not defined')
    } else if (!validateAmount(String(amount))) {
      throw new Error('Amount is not valid')
    }

    const tokenWithHolding = UtilsHelper.clone(token)
    const fiatWithHolding = UtilsHelper.clone(fiat)
    const tipWithHolding = UtilsHelper.clone(tip)

    tokenWithHolding.amount = Number(amount)

    dispatch(RootStore.senderTransaction.actions.setToken(tokenWithHolding))
    dispatch(RootStore.senderTransaction.actions.setSenderAddress(senderAddress))
    dispatch(RootStore.senderTransaction.actions.setReceiverAddress(receiverAddress))
    dispatch(RootStore.senderTransaction.actions.setFeeAmount(priority))
    dispatch(RootStore.senderTransaction.actions.setFiat(Number(fiatWithHolding)))
    dispatch(RootStore.senderTransaction.actions.setTip(tipWithHolding))

    prop.navigation.navigate(wrapper.route.SendTransactionReviewModal.name)
  }, [token, amount, fiat, tip, priority, account, tokens])

  const validateAmount = (val: string) => {
    const hasEnoughBalance = getTokenBalance() >= Number(val) || val?.length === 0
    return hasEnoughBalance
  }

  const validateFiat = (val: string) => {
    if (token?.symbol) {
      const ratio = exchange[account.blockchain][token?.symbol]?.to[currency] ?? null
      if (ratio) {
        const hasEnoughBalance = getTokenBalance() * ratio >= Number(val)
        return hasEnoughBalance
      } else return true
    } else return true
  }

  const validateAddress = (val: string) => {
    return blockchainServices[account.blockchain].validateAddress(val)
  }

  const validateFields = () => {
    let inputIsValid = true
    if (!token) {
      inputIsValid = false
    } else if (!account.address) {
      inputIsValid = false
    } else if (!amount || amount <= 0) {
      inputIsValid = false
    } else if (!receiverAddress) {
      inputIsValid = false
    } else if (!validateAmount(String(amount)) || !validateAddress(receiverAddress)) {
      inputIsValid = false
    } else if (!isConnected) {
      inputIsValid = false
    }

    return inputIsValid
  }

  const getTokenBalance = useCallback(() => {
    if (!token) return 0
    return account.getBalanceAmountByAsset(token.symbol) ?? 0
  }, [token, account])

  const getRemainingTokenBalance = useCallback(() => {
    const total = getTokenBalance()
    if (!total) return 0

    return total - (Number(amount) ?? 0)
  }, [amount, getTokenBalance])

  // Typeguard
  function isURI(object: any): object is IURI {
    return !!(object as IURI).address
  }

  const selectContactOrAccount = useCallback((item: Contact | Account, addressSelected?: string) => {
    if (addressSelected) {
      handleAddressChanged(addressSelected)
    } else {
      'address' in item && item.address !== null && handleAddressChanged(item.address)
    }
  }, [])

  const getDecimalsOfToken = useCallback(
    (token: TokenAsset) => {
      const decimalsToken = tokens.find(
        it => it.symbol === token.symbol && it.blockchain === token.blockchain
      )?.decimals
      if (decimalsToken !== null) {
        return decimalsToken
      }
      return undefined
    },
    [tokens]
  )

  const handleAmountChanged = useCallback(
    (val: string) => {
      if (token) {
        const decimals = getDecimalsOfToken(token)
        val = val.replace(/,|\.\.|\.,/g, '.')
        val = val.replace(/\s|-/g, '')
        val = val.replace(/[0-9]+\.[0-9]{9,}$/g, String(Number(val).toFixed(decimals ?? 2)))
        if (decimals !== undefined && decimals < 1) val = val.replace('.', '')
        setAmount(val)
      }
    },
    [token]
  )

  const handleFiatChanged = useCallback((val: string) => {
    val = val.replace(/,|\.\.|\.,/g, '.')
    val = val.replace(/\s|-/g, '')
    val = val.replace(/[0-9]+\.[0-9]{3,}$/g, String(Number(val).toFixed(2)))
    setFiat(val)
  }, [])

  const handleAddressChanged = useCallback(
    (addressValue: string) => {
      const cleanAddressValue = UtilsHelper.clearText(addressValue)
      setContact(undefined)
      const contactFound = contacts.find(value => value.addresses.find(({ address }) => address === cleanAddressValue))
      const accountFound = accounts.find(it => it.address === cleanAddressValue)
      if (accountFound) {
        const accountContact = new Contact()
        accountContact.name = `${accountFound.getWallet(wallets)?.name} / ${accountFound.name}`

        accountContact.addresses.push({
          address: cleanAddressValue,
          blockchain: accountFound.blockchain,
        })
        setContact(accountContact)
      } else if (contactFound) {
        setContact(contactFound)
      }
      setReceiverAddress(cleanAddressValue)
    },
    [contacts, account, accounts]
  )

  const handleQrCode = (data: IURI | string) => {
    if (isURI(data)) {
      handleAddressChanged(data.address)
    } else {
      handleAddressChanged(data)
    }
  }

  return show ? (
    <InputScrollView
      useAnimatedScrollView
      keyboardOffset={300}
      showsVerticalScrollIndicator={false}
      style={{
        width: '100%',
        marginTop: headerHeight,
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
      <LinearLayout orientation="verti">
        <TextView mb="24px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
          {walletTitle}
        </TextView>

        <AccountCard account={account} />

        <ButtonView
          activeOpacity={0.4}
          onPress={() => {
            prop.navigation.reset({
              index: 1,
              routes: [{ name: wrapper.route.ListWalletsPage.name }, { name: wrapper.route.GetWallet.name }],
            })
            prop.navigation.goBack()
          }}
        >
          <LinearLayout orientation="horiz" alignSelf="center" alignItems="center" mt="40px">
            <ImageView source={require('~/src/assets/images/icon-reselect-green.png')} />
            <TextView ml="6px" color="primary" fontFamily="medium">
              {I18n.t('modals.send.transactionInput.selectDifferentAccount')}
            </TextView>
          </LinearLayout>
        </ButtonView>

        <TextView mt="40px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
          {I18n.t('modals.send.transactionInput.transactionDetails')}
        </TextView>

        <DestinationAddressField
          blockchain={account.blockchain}
          address={receiverAddress}
          onAddressChanged={handleAddressChanged}
          contact={contact}
          onSelected={selectContactOrAccount}
          handleQrCode={handleQrCode}
          validateAddress={validateAddress}
          onValidateAddress={addressIsValid => {
            setIsValidTransaction(!addressIsValid)
          }}
        />

        <TokenField
          account={account}
          navigation={prop.navigation}
          token={token}
          setToken={setToken}
          tokenFromUri={tokenFromUri}
        />

        <AmountField
          amount={amount}
          setAmount={a => setAmount(a)}
          setFiat={a => setFiat(a)}
          setFieldTyping={a => setFieldTyping(a)}
          onAmountChanged={handleAmountChanged}
          onFiatChanged={handleFiatChanged}
          fiat={fiat}
          token={token}
          tokenBalance={getTokenBalance()}
          remainingTokenBalance={getRemainingTokenBalance()}
          validatorAmount={validateAmount}
          validatorFiat={validateFiat}
          account={account}
          currency={currency}
        />

        {account.blockchain === 'neoLegacy' && (
          <>
            <TextView mt="56px" mb="24px" fontFamily="semibold" color="text.0" alignSelf="center" fontSize="14px">
              {I18n.t('modals.send.transactionInput.prioritiseTransfer').toUpperCase()}
            </TextView>
            <PriorityTab priority={priority} changePriority={changePriority} feeTokenSymbol={cozTip?.token} />
          </>
        )}

        {account.blockchain === 'neo3' && (
          <TransactionFeeNeo3
            blockchain={account.blockchain}
            account={account}
            amount={Number(amount)}
            receiverAddress={receiverAddress}
            token={token}
            onInsuficientFunds={notHasFunds => {
              setIsValidTransaction(notHasFunds)
            }}
            onChangeAmountFee={gasFee => {
              setPriority(CustomPriotity(gasFee, cozTip?.token))
            }}
          />
        )}

        {cozTip && (
          <TipCheckbox
            tokenTipAmount={tokenTipAmount}
            blockchain={account.blockchain}
            tokenTip={cozTip.token}
            address={cozTip.address}
            fiat={Number(fiat)}
            label={I18n.t('modals.send.transactionInput.tipCheckboxLabel', {
              tipValue: tip ? tip.amount.toFixed(8) : '0',
            })}
            dispatchTip={setTip}
            mainAsset={token?.name}
            feeAmount={priority.fee}
            navigation={prop.navigation}
          />
        )}
      </LinearLayout>
      <LinearLayout mb="58px" px="24px" alignSelf="center" width="100%">
        <ThemedButton label={I18n.t('app.next')} onPress={submit} disabled={!validateFields() || isValidTransaction} />
      </LinearLayout>
    </InputScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendTransactionInputModal
