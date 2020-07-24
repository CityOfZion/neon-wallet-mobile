import {RouteProp} from '@react-navigation/native'
import React, {Fragment, useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import NeonQRCode from '~src/components/QRCode'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import TabSelector from '~src/components/TabSelector'
import ThemedButton from '~src/components/themed/ThemedButton'
import {mockWalletItems} from '~src/mocks/mockWalletItems'
import {TokenValue} from '~src/models/TokenValue'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

const AddressContent = () => {
  return (
    <Fragment>
      <NeonQRCode
        content={'AN8iLVt18CKoATdexztCQj923hw5gkc41A'}
        qrCodeWidth={300}
      />
      <LinearLayout width={'100%'} height={54} my={34}>
        <ThemedButton
          label={Facade.t('app.copyToClipboard')}
          srcIcon={require('~/src/assets/images/icon-copy-green.png')}
          iconSize={[19, 23]}
        />
      </LinearLayout>
    </Fragment>
  )
}

const TokenField = (props: {
  theme: ApplicationTheme
  token: TokenValue | null
  setToken: React.Dispatch<React.SetStateAction<TokenValue | null>>
  nav: StackNavigationProp<ModalStackParamList>
}) => {
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.send.transactionInput.token')}
        color={'text.0'}
        marginTop={0}
        marginBottom={20}
        capitalize={true}
      />

      <ButtonView
        onPress={() => {
          props.nav.navigate(Facade.route.ListTokenModal.name, {
            selectedToken: props.token ?? null,
            setToken: props.setToken,
          })
        }}
      >
        <LinearLayout position="relative">
          <InputWithValidation
            color={props.theme.colors.text[0]}
            invalidColor={props.theme.colors.text[10]}
            fontStyle={'normal'}
            value={props.token?.name ?? ''}
            placeholder={Facade.t(
              'modals.receive.toAccount.selectTokenToReceive'
            )}
            validator={() => true}
            separatorColor={props.theme.colors.background[13]}
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
      </ButtonView>
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
        marginTop={42}
        marginBottom={20}
        capitalize={true}
      />
      <InputWithValidation
        onChangeText={(text) => props.setAmount(Number(text))}
        color={props.theme.colors.text[0]}
        invalidColor={props.theme.colors.text[10]}
        fontStyle={'normal'}
        value={String(props.amount)}
        placeholder={Facade.t('modals.receive.toAccount.enterAmount')}
        validator={() => true}
        separatorColor={props.theme.colors.background[13]}
        sideMargins={0}
        hidePaste={true}
        hideScan={true}
        keyboardType="numeric"
      />
    </Fragment>
  )
}

const ReferenceField = (props: {
  theme: ApplicationTheme
  reference: string
  setReference: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <Fragment>
      <InputLabel
        title={Facade.t('modals.receive.toAccount.reference')}
        color={'text.0'}
        marginTop={42}
        marginBottom={20}
        capitalize={true}
      />
      <InputWithValidation
        onChangeText={props.setReference}
        color={props.theme.colors.text[0]}
        invalidColor={props.theme.colors.text[10]}
        fontStyle={'normal'}
        value={props.reference}
        placeholder={Facade.t('modals.receive.toAccount.addReference')}
        validator={() => true}
        separatorColor={props.theme.colors.background[13]}
        sideMargins={0}
        hidePaste={true}
        hideScan={true}
      />
    </Fragment>
  )
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveToAccountModal'>
}

const ReceiveToAccountModal = (props: Props) => {
  const controller = useSwiperController(true)
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [isAddressTabSelected, setAddressTabAsSelected] = useState<boolean>(
    true
  )
  const [amount, setAmount] = useState<number>(0)
  const [reference, setReference] = useState<string>('')
  const [token, setToken] = useState<TokenValue | null>(null)

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={Facade.t('modals.receive.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~src/assets/images/download-white.png')}
    >
      <LinearLayout height="100%" width="100%" px="15px" orientation="verti">
        <TextView
          mb="24px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {props.route.params.walletTitle.toUpperCase()}
        </TextView>
        <AccountCard account={props.route.params.account} />
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
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
        <TabSelector
          isFirstTabSelected={isAddressTabSelected}
          setFirstTabAsSelected={setAddressTabAsSelected}
          firstTabLabel={Facade.t('modals.receive.toAccount.yourAddress')}
          secondTabLabel={Facade.t('modals.receive.toAccount.requestTokens')}
          mb={isAddressTabSelected ? 38 : 46}
          capitalize={true}
        />
        {isAddressTabSelected ? (
          <AddressContent />
        ) : (
          <LinearLayout orientation="verti" justifyContent="space-between">
            <TokenField
              theme={theme}
              token={token}
              setToken={setToken}
              nav={props.navigation}
            />
            <AmountField theme={theme} amount={amount} setAmount={setAmount} />
            <ReferenceField
              theme={theme}
              reference={reference}
              setReference={setReference}
            />
            <LinearLayout width={'100%'} height={54} my={34}>
              <ThemedButton
                label={Facade.t('modals.receive.toAccount.generateQrCode')}
                srcIcon={require('~/src/assets/images/icon-qrcode-green.png')}
                iconSize={[19, 23]}
              />
            </LinearLayout>
          </LinearLayout>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ReceiveToAccountModal
