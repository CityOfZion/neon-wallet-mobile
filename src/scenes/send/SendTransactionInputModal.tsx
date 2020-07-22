import React, {Fragment, useState} from 'react'
import {ScrollView, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputTextWithValidation'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {mockWalletItems} from '~src/mocks/mockWalletItems'
import {Account} from '~src/models/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import SendTransactionReviewModal from '~src/scenes/send/SendTransactionReviewModal'
import {
  ButtonView,
  ImageView,
  InputTextView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

export enum Priority {
  FAST,
  FASTER,
  FASTEST,
}

const priorityIconInactive = require('~src/assets/images/icon-flash-grey.png')
const priorityIconActive = require('~src/assets/images/icon-flash-primary.png')

const PriorityTab = () => {
  const [priority, setPriority] = useState(Priority.FAST)

  return (
    <LinearLayout
      orientation="horiz"
      bg="background.1"
      borderRadius={8}
      mb="58px"
      height="75px"
    >
      <ButtonView
        bg={priority === Priority.FAST ? 'background.0' : 'background.1'}
        weight={1}
        p="16px"
        borderBottomLeftRadius={8}
        borderTopLeftRadius={8}
        justifyContent="center"
        onPress={() => setPriority(Priority.FAST)}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              priority === Priority.FAST
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={priority === Priority.FAST ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              Fast
            </TextView>
            <TextView
              color={priority === Priority.FAST ? 'primary' : 'text.3'}
              fontSize="12px"
            >
              0.00001 GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={priority === Priority.FASTER ? 'background.0' : 'background.1'}
        p="16px"
        borderStyle="solid"
        borderLeftWidth={1}
        borderRightWidth={1}
        borderColor="black"
        justifyContent="center"
        onPress={() => setPriority(Priority.FASTER)}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              priority === Priority.FASTER
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={priority === Priority.FASTER ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              Faster
            </TextView>
            <TextView
              color={priority === Priority.FASTER ? 'primary' : 'text.3'}
              fontSize="12px"
            >
              0.00001 GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={priority === Priority.FASTEST ? 'background.0' : 'background.1'}
        p="16px"
        borderBottomRightRadius={8}
        borderTopRightRadius={8}
        justifyContent="center"
        onPress={() => setPriority(Priority.FASTEST)}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={
              priority === Priority.FASTEST
                ? priorityIconActive
                : priorityIconInactive
            }
          />
          <LinearLayout ml="8px">
            <TextView
              color={priority === Priority.FASTEST ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              Fastest
            </TextView>
            <TextView
              color={priority === Priority.FASTEST ? 'primary' : 'text.3'}
              fontSize="12px"
            >
              0.00001 GAS
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}

const DestinationAddressField = (props: {
  theme: ApplicationTheme
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.destinationAddress')}
        color={'text.0'}
        marginTop={30}
        marginBottom={20}
      />
      <InputWithValidation
        onChangeText={props.setAddress}
        color={props.theme.colors.text[3]}
        fontStyle={'normal'}
        value={props.address}
        placeholder={Facade.t('modals.send.transactionInput.enterDestination')}
        inputIsValid={true}
        separatorColor={props.theme.colors.background[3]}
        sideMargins={0}
        hidePaste={true}
        hideScan={true}
      />
      <LinearLayout
        orientation="horiz"
        justifyContent="space-between"
        mt="24px"
        px="12px"
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={require('~/src/assets/images/icon-contacts-green.png')}
          />
          <TextView ml="8px" fontFamily="semibold" color="primary">
            {Facade.t('modals.send.transactionInput.contacts')}
          </TextView>
        </LinearLayout>
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={require('~/src/assets/images/icon-paste-green.png')}
          />
          <TextView ml="8px" fontFamily="semibold" color="primary">
            {Facade.t('modals.send.transactionInput.paste')}
          </TextView>
        </LinearLayout>
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView
            source={require('~/src/assets/images/icon-qrcode-green.png')}
          />
          <TextView ml="8px" fontFamily="semibold" color="primary">
            {Facade.t('modals.send.transactionInput.scan')}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </Fragment>
  )
}

const TokenField = (props: {theme: ApplicationTheme; token: string}) => {
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.token')}
        color={'text.0'}
        marginTop={30}
        marginBottom={20}
      />
      <LinearLayout position="relative">
        <InputWithValidation
          color={props.theme.colors.text[0]}
          fontStyle={'normal'}
          value={props.token}
          placeholder={Facade.t('modals.send.transactionInput.selectToken')}
          inputIsValid={true}
          separatorColor={props.theme.colors.background[3]}
          sideMargins={0}
          hidePaste={true}
          hideScan={true}
          editable={false}
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
    </Fragment>
  )
}

const AmountField = (props: {
  theme: ApplicationTheme
  amount: number
  setAmount: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.amount')}
        color={'text.0'}
        marginTop={30}
        marginBottom={20}
      />
      <InputWithValidation
        onChangeText={(text) => props.setAmount(Number(text))}
        color={props.theme.colors.text[3]}
        fontStyle={'normal'}
        value={String(props.amount)}
        placeholder={Facade.t('modals.send.transactionInput.enterAmount')}
        inputIsValid={true}
        separatorColor={props.theme.colors.background[3]}
        sideMargins={0}
        hidePaste={true}
        hideScan={true}
        keyboardType="numeric"
      />
    </Fragment>
  )
}

const SendTransactionInputModal = (props: Props) => {
  const controller = useSwiperController(true)
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [account, setAccount] = useState<Account>(mockWalletAccounts[0])
  const [text, setText] = useState('')
  const [amount, setAmount] = useState(0)

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
      <LinearLayout height="100%" width="100%" px="15px" orientation="verti">
        <TextView
          mb="24px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {mockWalletItems[1].title}
        </TextView>
        <AccountCard account={account} />
        <TouchableWithoutFeedback>
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
              {Facade.t(
                'modals.send.transactionInput.selectDifferentAccount'
              )}
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
          theme={theme}
          address={text}
          setAddress={setText}
        />
        <TokenField theme={theme} token={'NEO'} />
        <AmountField theme={theme} amount={amount} setAmount={setAmount} />
        <TextView
          mt="56px"
          mb="24px"
          fontFamily="semibold"
          color="text.0"
          alignSelf="center"
          fontSize="14px"
        >
          {Facade.t('modals.send.transactionInput.prioritiseTransfer')}
        </TextView>
        <PriorityTab />
        <LinearLayout mb="58px" px="24px" alignSelf="center" width="100%">
          <ThemedButton
            label={Facade.t('app.next')}
            onPress={() =>
              props.navigation.navigate(
                Facade.route.SendTransactionReviewModal.name
              )
            }
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionInputModal
