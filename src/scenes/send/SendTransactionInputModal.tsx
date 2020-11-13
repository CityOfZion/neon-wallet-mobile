import {RouteProp, useNavigationState} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack'
import React, {Fragment, useEffect, useState} from 'react'
import {Alert} from 'react-native'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import InputScrollView from 'react-native-input-scroll-view'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Currency} from '~/src/enums/Currency'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {
  PANEL_OFFSET,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {NeoURI} from '~src/helpers/UriHelper'
import {
  FasterPriority,
  FastestPriority,
  FastPriority,
  NoPriority,
  PriorityFee,
} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface SendTransactionInputModalParams {
  walletTitle: string
  account: Account
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & SendModalStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendTransactionInputModal'>
}

const PriorityTab = (props: {
  priority: PriorityFee
  changePriority: (p: PriorityFee) => void
}) => {
  const priorityIconInactive = require('~src/assets/images/icon-flash-grey.png')
  const priorityIconActive = require('~src/assets/images/icon-flash-primary.png')

  return (
    <LinearLayout
      orientation="horiz"
      bg="background.1"
      borderRadius={8}
      mb="58px"
      height="75px"
    >
      <ButtonView
        bg={
          props.priority.equals(FastPriority())
            ? 'background.0'
            : 'background.1'
        }
        weight={1}
        p="16px"
        borderBottomLeftRadius={8}
        borderTopLeftRadius={8}
        justifyContent="center"
        onPress={() => props.changePriority(FastPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              props.priority.equals(FastPriority())
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={
                props.priority.equals(FastPriority()) ? 'primary' : 'text.3'
              }
              fontSize="16px"
              fontFamily="semibold"
            >
              {FastPriority().name}
            </TextView>
            <TextView
              color={
                props.priority.equals(FastPriority()) ? 'primary' : 'text.3'
              }
              fontSize="12px"
            >
              {FastPriority().fee} GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={
          props.priority.equals(FasterPriority())
            ? 'background.0'
            : 'background.1'
        }
        p="16px"
        borderStyle="solid"
        borderLeftWidth={1}
        borderRightWidth={1}
        borderColor="black"
        justifyContent="center"
        onPress={() => props.changePriority(FasterPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              props.priority.equals(FasterPriority())
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={
                props.priority.equals(FasterPriority()) ? 'primary' : 'text.3'
              }
              fontSize="16px"
              fontFamily="semibold"
            >
              {FasterPriority().name}
            </TextView>
            <TextView
              color={
                props.priority.equals(FasterPriority()) ? 'primary' : 'text.3'
              }
              fontSize="12px"
            >
              {FasterPriority().fee} GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={
          props.priority.equals(FastestPriority())
            ? 'background.0'
            : 'background.1'
        }
        p="16px"
        borderBottomRightRadius={8}
        borderTopRightRadius={8}
        justifyContent="center"
        onPress={() => props.changePriority(FastestPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              props.priority.equals(FastestPriority())
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={
                props.priority.equals(FastestPriority()) ? 'primary' : 'text.3'
              }
              fontSize="16px"
              fontFamily="semibold"
            >
              {FastestPriority().name}
            </TextView>
            <TextView
              color={
                props.priority.equals(FastestPriority()) ? 'primary' : 'text.3'
              }
              fontSize="12px"
            >
              {FastestPriority().fee} GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}

const DestinationAddressField = (props: {
  address: string
  contact?: Contact
  onAddressChanged: (address: string) => void
  onSelected: (item: Contact | Account) => void
  handleQrCode: (data: NeoURI | string) => void
}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.destinationAddress')}
        color={'text.0'}
        marginTop={30}
        marginBottom={30}
        capitalize={true}
      />
      <InputWithValidation
        onChangeText={props.onAddressChanged}
        color={theme.colors.text[0]}
        invalidColor={theme.colors.text[10]}
        value={props.address}
        placeholder={Facade.t('modals.send.transactionInput.enterDestination')}
        validator={() => true}
        separatorColor={theme.colors.background[13]}
        sideMargins={0}
        showContacts={true}
        selectedContact={props.contact}
        onSelected={props.onSelected}
        onScan={props.handleQrCode}
      />
    </Fragment>
  )
}

const TokenField = (props: {
  navigation: StackNavigationProp<ModalStackParamList & SendModalStackParamList>
  account: Account
  token: TokenAsset | null
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null>>
}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.token')}
        color={'text.0'}
        marginTop={50}
        marginBottom={30}
        capitalize={true}
      />

      <ButtonView
        onPress={() => {
          props.navigation.navigate(Facade.route.ListTokenModal.name, {
            selectedToken: props.token,
            setToken: props.setToken,
            account: props.account,
            filterBy: 'send',
          })
        }}
      >
        <LinearLayout position="relative">
          <InputWithValidation
            color={theme.colors.text[0]}
            invalidColor={theme.colors.text[10]}
            fontStyle={'normal'}
            value={props.token?.name ?? ''}
            placeholder={Facade.t('modals.send.transactionInput.selectToken')}
            validator={() => true}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste={true}
            hideScan={true}
            editable={false}
            srcIcon={props.token?.srcIcon}
          />
          <ImageView
            position="absolute"
            top="10px"
            right="15px"
            resizeMode="contain"
            width="12px"
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
      </ButtonView>
    </Fragment>
  )
}

const AmountField = (props: {
  validatorAmount: (val: string) => boolean
  validatorFiat: (val: string) => boolean
  token: TokenAsset | null
  amount: number
  fiat: number
  setAmount: (amount: number) => void
  setFiat: (fiat: number) => void
  tokenBalance: number
  remainingTokenBalance: number
  account: Account
  currency: Currency
}) => {
  const setValue = (val: string, roundDown?: boolean) => {
    var valueNumber
    if (roundDown) {
      valueNumber = Math.floor(Number(val))
    } else valueNumber = Number(val)

    if (!valueNumber) return

    val = val.replace(',', '')
    if (props.token?.symbol === 'NEO') val = val.replace('.', '')

    props.setAmount(Number(val))
  }
  const {language} = useSelector((state: RootState) => state.settings)
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  return (
    <Fragment>
      <LinearLayout
        orientation={'horiz'}
        justifyContent={'space-between'}
        mt={30}
        mb={20}
      >
        <LinearLayout weight={2}>
          <InputLabel
            title={Facade.t('modals.send.transactionInput.amount')}
            color={'text.0'}
            capitalize={true}
          />
        </LinearLayout>
        <LinearLayout orientation={'horiz'} alignItems={'center'}>
          <TextView mr={'6px'} color={'text.10'}>
            {Facade.t('modals.send.transactionInput.totalAfterTransaction')}
          </TextView>
          <TextView color={'text.0'} fontFamily={'bold'} fontSize={'16px'}>
            {Facade.filter.decimal(props.remainingTokenBalance, language)}
          </TextView>
        </LinearLayout>
        <ButtonView
          p={'8px'}
          onPress={() => setValue(String(props.tokenBalance))}
        >
          <TextView color={'primary'} fontSize={'15px'} fontFamily={'medium'}>
            {Facade.t('modals.send.transactionInput.max')}
          </TextView>
        </ButtonView>
      </LinearLayout>
      <LinearLayout
        position={'relative'}
        orientation={'horiz'}
        justifyContent={'space-between'}
      >
        <LinearLayout width={'45%'}>
          <InputWithValidation
            onChangeText={(val) => setValue(val)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.text[10]}
            invalidMessageColor={theme.colors.quinary}
            value={props.amount !== null ? String(props.amount) : ''}
            placeholder={
              Facade.t('modals.send.transactionInput.enterValue') +
              (props.token?.symbol ?? 'NEO')
            }
            validator={(val) => props.validatorAmount(val)}
            invalidMessage={Facade.t(
              'modals.send.transactionInput.insufficientFunds'
            )}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste={true}
            hideScan={true}
            keyboardType="numeric"
            editable={Boolean(props.token)}
          />
        </LinearLayout>
        <LinearLayout width={'45%'}>
          <LinearLayout height={'50px'}>
            <InputWithValidation
              onChangeText={(val) => props.setFiat(Number(val))}
              color={theme.colors.text[0]}
              invalidColor={theme.colors.text[10]}
              invalidMessageColor={theme.colors.quinary}
              value={props.fiat !== null ? String(props.fiat.toFixed(2)) : ''}
              placeholder={
                Facade.t('modals.send.transactionInput.enterValue') +
                props.currency
              }
              validator={(val) => props.validatorFiat(val)}
              invalidMessage={Facade.t(
                'modals.send.transactionInput.insufficientFunds'
              )}
              separatorColor={theme.colors.background[13]}
              sideMargins={0}
              hidePaste={true}
              hideScan={true}
              keyboardType="numeric"
              editable={Boolean(props.token)}
            />
          </LinearLayout>
          <ButtonView
            alignSelf={'flex-end'}
            onPress={() => props.setFiat(Math.floor(props.fiat))}
          >
            <LinearLayout orientation={'horiz'}>
              <ImageView
                mr={'3'}
                alignSelf={'center'}
                source={require('~src/assets/images/round-down-arrows.png')}
                resizeMode="contain"
              />
              <TextView
                color={'primary'}
                fontSize={'15px'}
                fontFamily={'medium'}
                mb={'2'}
              >
                {Facade.t('modals.send.transactionInput.roundDown')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        </LinearLayout>
      </LinearLayout>
    </Fragment>
  )
}

const SendTransactionInputModal = (prop: Props) => {
  const {account, walletTitle, uri} = prop.route.params
  const {contacts, tokens, accounts, wallets, exchange} = useSelector(
    (state: RootState) => state.app
  )
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const [receiverAddress, setReceiverAddress] = useState(
    prop.route.params?.uri?.address ?? ''
  )
  const [amount, setAmount] = useState(uri?.amount ?? 0)
  const [fiat, setFiat] = useState(0)
  const hash = prop.route.params?.uri?.tokenHash ?? ''

  const [contact, setContact] = useState<Contact>()
  const [token, setToken] = useState<TokenAsset | null>(
    tokens.find((t: TokenAsset) => t.hash === hash) ?? null
  )
  const [priority, setPriority] = useState<PriorityFee>(FastPriority())

  const dispatch = useDispatch<DispatchResult>()

  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.SendTransactionInputModal.name
  )

  useEffect(() => {
    if (token?.symbol) {
      const ratio = exchange[token?.symbol]?.to[currency] ?? null
      if (ratio) {
        setFiat(ratio * amount)
      }
    }
  }, [amount])

  useEffect(() => {
    if (token?.symbol) {
      const ratio = exchange[token?.symbol]?.to[currency] ?? null
      if (ratio) {
        setAmount(fiat / ratio)
      }
    }
  }, [fiat])

  const changePriority = (newPriority: PriorityFee) => {
    if (priority.equals(newPriority)) {
      setPriority(NoPriority)
    } else {
      setPriority(newPriority)
    }
  }

  const submit = () => {
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

    const tokenWithHolding = Facade.utils.clone(token)
    tokenWithHolding.amount = amount

    dispatch(RootStore.senderTransaction.actions.clearState())

    dispatch(RootStore.senderTransaction.actions.setToken(tokenWithHolding))
    dispatch(
      RootStore.senderTransaction.actions.setSenderAddress(senderAddress)
    )
    dispatch(
      RootStore.senderTransaction.actions.setReceiverAddress(receiverAddress)
    )
    dispatch(RootStore.senderTransaction.actions.setFeeAmount(priority))

    prop.navigation.navigate(Facade.route.SendTransactionReviewModal.name)
  }

  const validateAmount = (val: string) => {
    const hasEnoughBalance = getTokenBalance() >= Number(val)
    return hasEnoughBalance
  }

  const validateFiat = (val: string) => {
    if (token?.symbol) {
      const ratio = exchange[token?.symbol]?.to[currency] ?? null
      if (ratio) {
        const hasEnoughBalance = getTokenBalance() * ratio >= Number(val)
        return hasEnoughBalance
      }
    } else return true
  }

  const validateFields = () => {
    let inputIsValid = true
    if (!token) {
      inputIsValid = false
    } else if (!account.address) {
      inputIsValid = false
    } else if (!amount) {
      inputIsValid = false
    } else if (!validateAmount(String(amount)) || !validateFiat(String(fiat))) {
      inputIsValid = false
    }
    return inputIsValid
  }

  const getTokenBalance = () => {
    if (!token) return 0

    return account.getBalanceAmountByAsset(token.symbol) ?? 0
  }

  const getRemainingTokenBalance = () => {
    const total = getTokenBalance()
    if (!total) return 0

    return total - (amount ?? 0)
  }

  // Typeguard
  function isURI(object: any): object is NeoURI {
    return !!(object as NeoURI).address
  }

  const selectContactOrAccount = (item: Contact | Account) => {
    if (item.address) {
      handleAddressChanged(item.address)
    }
  }

  const handleAddressChanged = (addressValue: string) => {
    setContact(undefined)
    const contact = contacts.find((value) => value.address === addressValue)
    const account = accounts.find((it) => it.address === addressValue)
    if (account) {
      const accountContact = new Contact()
      accountContact.name = `${account.getWallet(wallets)?.name} / ${
        account.name
      }`

      accountContact.address = addressValue
      setContact(accountContact)
    } else if (contact) {
      setContact(contact)
    }
    setReceiverAddress(addressValue)
    prop.navigation.navigate(Facade.route.SendTransactionReviewModal.name)
  }

  const handleQrCode = (data: NeoURI | string) => {
    if (isURI(data)) {
      handleAddressChanged(data.address)
    } else {
      handleAddressChanged(data)
    }
  }

  return show ? (
    <InputScrollView
      useAnimatedScrollView={true}
      keyboardOffset={300}
      showsVerticalScrollIndicator={false}
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
      <LinearLayout orientation="verti">
        <TextView
          mb="24px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {walletTitle}
        </TextView>

        <AccountCard account={account} />

        <TouchableWithoutFeedback onPress={() => prop.navigation.goBack()}>
          <LinearLayout
            orientation="horiz"
            alignSelf="center"
            alignItems="center"
            mt="40px"
          >
            <ImageView
              source={require('~/src/assets/images/icon-reselect-green.png')}
            />
            <TextView ml="6px" color="primary" fontFamily="medium">
              {Facade.t('modals.send.transactionInput.selectDifferentAccount')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>

        <TextView
          mt="40px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {Facade.t('modals.send.transactionInput.transactionDetails')}
        </TextView>

        <DestinationAddressField
          address={receiverAddress}
          onAddressChanged={handleAddressChanged}
          contact={contact}
          onSelected={selectContactOrAccount}
          handleQrCode={handleQrCode}
        />

        <TokenField
          account={account}
          navigation={prop.navigation}
          token={token}
          setToken={setToken}
        />

        <AmountField
          amount={amount}
          setAmount={(a) => setAmount(a)}
          setFiat={(a) => setFiat(a)}
          fiat={fiat}
          token={token}
          tokenBalance={getTokenBalance()}
          remainingTokenBalance={getRemainingTokenBalance()}
          validatorAmount={validateAmount}
          validatorFiat={validateFiat}
          account={account}
          currency={currency}
        />

        <TextView
          mt="56px"
          mb="24px"
          fontFamily="semibold"
          color="text.0"
          alignSelf="center"
          fontSize="14px"
        >
          {Facade.t(
            'modals.send.transactionInput.prioritiseTransfer'
          ).toUpperCase()}
        </TextView>

        <PriorityTab priority={priority} changePriority={changePriority} />
      </LinearLayout>
      <LinearLayout mb="58px" px="24px" alignSelf="center" width="100%">
        <ThemedButton
          label={Facade.t('app.next')}
          onPress={submit}
          disabled={!validateFields()}
        />
      </LinearLayout>
    </InputScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendTransactionInputModal
