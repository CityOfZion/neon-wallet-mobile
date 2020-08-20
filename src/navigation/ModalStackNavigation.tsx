import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {
  PersistContact,
  PersistContactParams,
} from '~src/components/contacts/PersistContact'
import {
  AccountQRCode,
  AccountQRCodeParams,
} from '~src/scenes/Account/AccountQRCode'
import {GetAccountParams} from '~src/scenes/Account/GetAccountView'
import {
  ContactPicker,
  ContactsModalParams,
} from '~src/scenes/Contacts/ContactPicker'
import CreateAccountModal from '~src/scenes/CreateAccountModal'
import CurrencyPickerModal from '~src/scenes/CurrencyPickerModal'
import CustomColorPage, {
  CustomColorPageParam,
} from '~src/scenes/CustomColorPage'
import EditAccountModal, {
  EditAccountModalParam,
} from '~src/scenes/EditAccountModal'
import {GetWalletParams} from '~src/scenes/GetWalletView'
import LanguagePickerModal from '~src/scenes/LanguagePickerModal'
import ListTokenModal, {ListTokenModalParams} from '~src/scenes/ListTokenModal'
import NetworkPickerModal from '~src/scenes/NetworkPickerModal'
import {QRCodeScanParams} from '~src/scenes/QRCodeScan'
import ReorderWalletModal from '~src/scenes/ReorderWalletModal'
import ThemePickerModal from '~src/scenes/ThemePickerModal'
import WalletContextModal from '~src/scenes/WalletContextModal'
import WelcomePage from '~src/scenes/WelcomePage'
import ReceiveAccountSelectionModal, {
  ReceiveAccountSelectionParams,
} from '~src/scenes/receive/ReceiveAccountSelectionModal'
import ReceiveQrCodeModal, {
  ReceiveQrCodeModalParams,
} from '~src/scenes/receive/ReceiveQrCodeModal'
import ReceiveToAccountModal, {
  ReceiveToAccountModalParams,
} from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'
import SendAccountSelectionModal, {
  SendAccountSelectionModalParams,
} from '~src/scenes/send/SendAccountSelectionModal'
import SendTransactionConfirmationModal, {
  SendTransactionConfirmationModalParams,
} from '~src/scenes/send/SendTransactionConfirmationModal'
import SendTransactionInputModal, {
  SendTransactionInputModalParams,
} from '~src/scenes/send/SendTransactionInputModal'
import SendTransactionReviewModal, {
  SendModalParams,
} from '~src/scenes/send/SendTransactionReviewModal'
import SendWalletSelectionModal, {
  SendWalletSelectionModalParams,
} from '~src/scenes/send/SendWalletSelectionModal'

export type ModalStackParamList = {
  WelcomeModal: undefined
  CreateAccountModal: undefined
  EditAccountModal: EditAccountModalParam
  AccountQRCode: AccountQRCodeParams
  ReceiveWalletSelectionModal: undefined
  ReceiveAccountSelectionModal: ReceiveAccountSelectionParams
  ReceiveToAccountModal: ReceiveToAccountModalParams
  ReceiveQrCodeModal: ReceiveQrCodeModalParams
  SendWalletSelectionModal: SendWalletSelectionModalParams
  SendAccountSelectionModal: SendAccountSelectionModalParams
  SendTransactionInputModal: SendTransactionInputModalParams
  SendTransactionReviewModal: undefined
  SendTransactionConfirmationModal: SendTransactionConfirmationModalParams
  CustomColor: {onColorPicked: (hex: string) => void}
  WalletContextModal: undefined
  ReorderWalletModal: undefined
  ListTokenModal: ListTokenModalParams
  LanguagePickerModal: undefined
  CurrencyPickerModal: undefined
  ThemePickerModal: undefined
  NetworkPickerModal: undefined
  PersistContact: PersistContactParams
  QRCodeScan: QRCodeScanParams
  ContactsModal: ContactsModalParams
}

// Add here params for modals that you need to navigate directly to, from a different stack
export type ModalParams =
  | DefaultNavigationParam<CustomColorPageParam>
  | DefaultNavigationParam<GetWalletParams>
  | DefaultNavigationParam<GetAccountParams>
  | DefaultNavigationParam<EditAccountModalParam>
  | DefaultNavigationParam<AccountQRCodeParams>
  | DefaultNavigationParam<SendWalletSelectionModalParams>
  | DefaultNavigationParam<SendModalParams>
  | DefaultNavigationParam<ReceiveQrCodeModalParams>
  | DefaultNavigationParam<ContactsModalParams>
  | DefaultNavigationParam<SendTransactionConfirmationModalParams>
  | DefaultNavigationParam<PersistContactParams>

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <ModalStack.Navigator
        initialRouteName={Facade.route.CreateAccountModal.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <ModalStack.Screen
          name={Facade.route.WelcomeModal.name}
          component={WelcomePage}
        />
        <ModalStack.Screen
          name={Facade.route.CreateAccountModal.name}
          component={CreateAccountModal}
        />
        <ModalStack.Screen
          name={Facade.route.EditAccountModal.name}
          component={EditAccountModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveAccountSelectionModal.name}
          component={ReceiveAccountSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveToAccountModal.name}
          component={ReceiveToAccountModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveQrCodeModal.name}
          component={ReceiveQrCodeModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendWalletSelectionModal.name}
          component={SendWalletSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendAccountSelectionModal.name}
          component={SendAccountSelectionModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionReviewModal.name}
          component={SendTransactionReviewModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionInputModal.name}
          component={SendTransactionInputModal}
        />
        <ModalStack.Screen
          name={Facade.route.SendTransactionConfirmationModal.name}
          component={SendTransactionConfirmationModal}
        />
        <ModalStack.Screen
          name={Facade.route.CustomColor.name}
          component={CustomColorPage}
        />
        <ModalStack.Screen
          name={Facade.route.WalletContextModal.name}
          component={WalletContextModal}
        />
        <ModalStack.Screen
          name={Facade.route.ReorderWalletModal.name}
          component={ReorderWalletModal}
        />
        <ModalStack.Screen
          name={Facade.route.ListTokenModal.name}
          component={ListTokenModal}
        />
        <ModalStack.Screen
          name={Facade.route.LanguagePickerModal.name}
          component={LanguagePickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.CurrencyPickerModal.name}
          component={CurrencyPickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.ThemePickerModal.name}
          component={ThemePickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.NetworkPickerModal.name}
          component={NetworkPickerModal}
        />
        <ModalStack.Screen
          name={Facade.route.PersistContact.name}
          component={PersistContact}
        />
        <ModalStack.Screen
          name={Facade.route.AccountQRCode.name}
          component={AccountQRCode}
        />
        <ModalStack.Screen
          name={Facade.route.ContactsModal.name}
          component={ContactPicker}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
