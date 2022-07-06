import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { Fragment, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ReceiveModalStackParamList } from '~/src/navigation/ReceiveModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import { QRCodeWithCopyButton } from '~src/components/QRCodeWithCopyButton'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import TabSelector from '~src/components/TabSelector'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
import { ApplicationTheme } from '~src/themes/ApplicationTheme'

const TokenField = (props: {
  theme: ApplicationTheme
  token: TokenAsset | null | undefined
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null | undefined>>
  nav: StackNavigationProp<RootStackParamList & ModalStackParamList>
  account: Account
}) => {
  return (
    <>
      <InputLabel
        title={i18n.t('modals.receive.toAccount.token')}
        color="text.0"
        marginTop={0}
        marginBottom={20}
        capitalize
      />

      <ButtonView
        onPress={() => {
          props.nav.navigate(wrapper.route.ListTokenModal.name, {
            onChangeToken: props.setToken,
            account: props.account,
            filterBy: 'receive',
          })
        }}
      >
        <LinearLayout position="relative">
          <InputWithValidation
            color={props.theme.colors.text[0]}
            invalidColor={props.theme.colors.text[10]}
            fontStyle="normal"
            value={props.token?.name ?? ''}
            placeholder={i18n.t('modals.receive.toAccount.selectTokenToReceive')}
            validator={() => true}
            separatorColor={props.theme.colors.background[13]}
            sideMargins={0}
            hidePaste
            hideScan
            editable={false}
          />
          <ImageView
            position="absolute"
            top="10px"
            right="15px"
            resizeMode="contain"
            width={Normalize.scale(12)}
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
      </ButtonView>
    </>
  )
}

const AmountField = (props: {
  theme: ApplicationTheme
  token?: TokenAsset
  amount: number | string
  setAmount: React.Dispatch<React.SetStateAction<number | string>>
}) => {
  const setValue = (val: string) => {
    val = val.replace(/,|\.\.|\.,/g, '.')
    val = val.replace(/\s|-/g, '')
    val = val.replace(/[0-9]+\.[0-9]{9,}$/g, String(Number(val).toFixed(8)))
    if (props.token?.symbol === 'NEO') {
      val = val.replace('.', '')
    }

    props.setAmount(val)
  }

  return (
    <>
      <InputLabel
        title={i18n.t('modals.receive.toAccount.amount')}
        color="text.0"
        marginTop={42}
        marginBottom={20}
        capitalize
      />
      <InputWithValidation
        onChangeText={text => setValue(text)}
        color={props.theme.colors.text[0]}
        invalidColor={props.theme.colors.text[10]}
        fontStyle="normal"
        value={props.amount !== null ? String(props.amount) : ''}
        placeholder={i18n.t('modals.receive.toAccount.enterAmount')}
        validator={() => true}
        separatorColor={props.theme.colors.background[13]}
        sideMargins={0}
        hidePaste
        hideScan
        keyboardType="numeric"
      />
    </>
  )
}

const ReferenceField = (props: {
  theme: ApplicationTheme
  reference: string
  setReference: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <InputLabel
        title={i18n.t('modals.receive.toAccount.reference')}
        color="text.0"
        marginTop={42}
        marginBottom={20}
        capitalize
      />
      <InputWithValidation
        onChangeText={props.setReference}
        color={props.theme.colors.text[0]}
        invalidColor={props.theme.colors.text[10]}
        value={props.reference}
        placeholder={i18n.t('modals.receive.toAccount.addReference')}
        validator={() => true}
        separatorColor={props.theme.colors.background[13]}
        sideMargins={0}
        hidePaste
        hideScan
      />
    </>
  )
}

export interface ReceiveToAccountModalParams {
  wallet: Wallet
  account: Account
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ReceiveModalStackParamList, 'ReceiveToAccountModal'>
}
const ReceiveToAccountModal = (props: Props) => {
  const controller = useSwiperController(true)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const [isAddressTabSelected, setAddressTabAsSelected] = useState<boolean>(true)
  const [amount, setAmount] = useState<number | string>('')
  const [reference, setReference] = useState<string>('')
  const [token, setToken] = useState<TokenAsset | null | undefined>(null)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange } = useExchange({ filter: { currencies: currency } })

  const { wallet, account } = props.route.params

  const navigate = () => {
    if (!isValid()) {
      return
    }

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReceiveModalStack.name,
      params: {
        screen: wrapper.route.ReceiveQrCodeModal.name,
        params: {
          wallet,
          account,
          amount: Number(amount),
          token: token!,
          reference,
        },
      },
    })
  }

  const isValid = () => {
    const conditions: boolean[] = [Boolean(account.address), Boolean(token)]
    return conditions.every(it => it)
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.receive.title')}
      padding={0}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onRightPress={controller.close}
      onClose={() => props.navigation.goBack()}
      solidColorBG
    >
      <LinearLayout height="100%" width="100%" px="24px" orientation="verti">
        <TextView mb="24px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
          {props.route.params.wallet.name?.toUpperCase() ?? ''}
        </TextView>
        <AccountCard exchange={exchange} account={props.route.params.account} hideCopy hideQRCode />
        <TouchableWithoutFeedback onPress={props.navigation.goBack}>
          <LinearLayout orientation="horiz" alignSelf="center" alignItems="center" mt="40px">
            <ImageView source={require('~/src/assets/images/icon-reselect-green.png')} />
            <TextView ml="6px" color="primary" fontFamily="medium">
              {i18n.t('modals.receive.toAccount.selectDifferentAccount')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
        <TabSelector
          isFirstTabSelected={isAddressTabSelected}
          setFirstTabAsSelected={setAddressTabAsSelected}
          firstTabLabel={i18n.t('modals.receive.toAccount.yourAddress')}
          secondTabLabel={i18n.t('modals.receive.toAccount.requestTokens')}
          mb={isAddressTabSelected ? 38 : 46}
          capitalize
        />
        {isAddressTabSelected ? (
          <QRCodeWithCopyButton qrCodeValue={props.route.params.account.address ?? ''} />
        ) : (
          <LinearLayout orientation="verti" justifyContent="space-between">
            <TokenField theme={theme} token={token} setToken={setToken} nav={props.navigation} account={account} />
            <AmountField theme={theme} amount={amount} setAmount={setAmount} />
            <ReferenceField theme={theme} reference={reference} setReference={setReference} />
            <LinearLayout width="100%" my={30}>
              <ThemedButton
                label={i18n.t('modals.receive.toAccount.generateQrCode')}
                srcIcon={require('~/src/assets/images/icon-qrcode-green.png')}
                iconSize={[19, 23]}
                onPress={navigate}
              />
            </LinearLayout>
          </LinearLayout>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ReceiveToAccountModal
