import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {VerifyPasscodePageParams} from '../scenes/LoginPage/VerifyPasscodePage'
import SecurityPickerModal from '../scenes/SecurityPickerModal'
import ReceiveModalStackNavigation from './ReceiveModalStackNavigation'
import {TabParams} from './TabNavigation'

import {Facade} from '~src/app/Facade'
import EditWalletModal, {
  EditWalletParams,
} from '~src/components/EditWalletModal'
import {
  PersistContact,
  PersistContactParams,
} from '~src/components/contacts/PersistContact'
import {PasscodeStackParams} from '~src/navigation/PasscodeStackNavigation'
import SendModalStackNavigation, {
  SendStackModalParams,
} from '~src/navigation/SendModalStackNavigation'
import {
  AccountQRCode,
  AccountQRCodeParams,
} from '~src/scenes/Account/AccountQRCode'
import {GetAccountParams} from '~src/scenes/Account/GetAccountView'
import ChangelogModal, {ChangelogModalParams} from '~src/scenes/ChangelogModal'
import {
  ContactPicker,
  ContactsModalParams,
} from '~src/scenes/Contacts/ContactPicker'
import CopyContextModal, {
  CopyContextModalParams,
} from '~src/scenes/CopyContextModal'
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
import ReorderWalletModal from '~src/scenes/ReorderWalletModal'
import ThemePickerModal from '~src/scenes/ThemePickerModal'
import {
  TransactionDetails,
  TransactionDetailsParams,
} from '~src/scenes/TransactionDetails'
import WalletContextModal, {
  WalletContextModalParams,
} from '~src/scenes/WalletContextModal'
import WelcomePage, {WelcomeModalParam} from '~src/scenes/WelcomePage'
import ReceiveAccountSelectionModal, {
  ReceiveAccountSelectionModalParams,
} from '~src/scenes/receive/ReceiveAccountSelectionModal'
import ReceiveQrCodeModal, {
  ReceiveQrCodeModalParams,
} from '~src/scenes/receive/ReceiveQrCodeModal'
import ReceiveToAccountModal, {
  ReceiveToAccountModalParams,
} from '~src/scenes/receive/ReceiveToAccountModal'
import ReceiveWalletSelectionModal from '~src/scenes/receive/ReceiveWalletSelectionModal'

export type ModalStackParamList = {
  WelcomeModal: WelcomeModalParam
  CreateAccountModal: undefined
  EditAccountModal: EditAccountModalParam
  AccountQRCode: AccountQRCodeParams
  ReceiveWalletSelectionModal: undefined
  ReceiveAccountSelectionModal: ReceiveAccountSelectionModalParams
  ReceiveToAccountModal: ReceiveToAccountModalParams
  ReceiveQrCodeModal: ReceiveQrCodeModalParams
  CustomColor: CustomColorPageParam
  WalletContextModal: WalletContextModalParams
  ReorderWalletModal: undefined
  ListTokenModal: ListTokenModalParams
  LanguagePickerModal: undefined
  CurrencyPickerModal: undefined
  ThemePickerModal: undefined
  NetworkPickerModal: undefined
  PersistContact: PersistContactParams
  ContactsModal: ContactsModalParams
  TransactionDetails: TransactionDetailsParams
  CopyContextModal: CopyContextModalParams
  SendModalStack: undefined
  EditWalletModal: EditWalletParams
  ReceiveModalStack: undefined
  SecurityModal: {isFirstTime?: boolean} | undefined
  Tab: TabParams
  PasscodeStack: PasscodeStackParams
  Modal: object
  VerifyPasscode: VerifyPasscodePageParams
  ChangelogModal: ChangelogModalParams
}

// Add here params for modals that you need to navigate directly to, from a different stack
export type ModalParams =
  | DefaultNavigationParam<CustomColorPageParam>
  | DefaultNavigationParam<GetWalletParams>
  | DefaultNavigationParam<GetAccountParams>
  | DefaultNavigationParam<EditAccountModalParam>
  | DefaultNavigationParam<AccountQRCodeParams>
  | DefaultNavigationParam<ReceiveQrCodeModalParams>
  | DefaultNavigationParam<ContactsModalParams>
  | DefaultNavigationParam<PersistContactParams>
  | DefaultNavigationParam<SendStackModalParams>
  | DefaultNavigationParam<EditWalletParams>
  | DefaultNavigationParam<ChangelogModalParams>
  | DefaultNavigationParam<WelcomeModalParam>
  | DefaultNavigationParam<WalletContextModalParams>

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
          name={Facade.route.ChangelogModal.name}
          component={ChangelogModal}
        />
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
          name={Facade.route.SendModalStack.name}
          component={SendModalStackNavigation}
        />
        <ModalStack.Screen
          name={Facade.route.ReceiveModalStack.name}
          component={ReceiveModalStackNavigation}
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
        <ModalStack.Screen
          name={Facade.route.CopyContextModal.name}
          component={CopyContextModal}
        />
        <ModalStack.Screen
          name={Facade.route.TransactionDetails.name}
          component={TransactionDetails}
        />
        <ModalStack.Screen
          name={Facade.route.EditWalletModal.name}
          component={EditWalletModal}
        />
        <ModalStack.Screen
          name={Facade.route.SecurityModal.name}
          component={SecurityPickerModal}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
