import {createStackNavigator} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {wrapper} from '../app/ApplicationWrapper'
import {screenConfig} from '../config/ScreenConfig'
import {VerifyPasscodePageParams} from '../scenes/LoginPage/VerifyPasscodePage'
import SecurityPickerModal from '../scenes/SecurityPickerModal'
import ReceiveModalStackNavigation from './ReceiveModalStackNavigation'
import {TabParams} from './TabNavigation'

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
import BlockchainListModal, {
  BlockchainListModalParams,
} from '~src/scenes/BlockchainListModal'
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
import ReorderWalletModal from '~src/scenes/ReorderWalletModal'
import ThemePickerModal from '~src/scenes/ThemePickerModal'
import TipConfirmationModal, {
  TipConfirmationModalParams,
} from '~src/scenes/TipConfirmationModal'
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
  TipConfirmationModal: TipConfirmationModalParams
  BlockchainListModal: BlockchainListModalParams
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
  | DefaultNavigationParam<BlockchainListModalParams>

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <ModalStack.Navigator
        initialRouteName={wrapper.route.CreateAccountModal.name}
        headerMode="none"
        screenOptions={screenConfig}
      >
        <ModalStack.Screen
          name={wrapper.route.ChangelogModal.name}
          component={ChangelogModal}
        />
        <ModalStack.Screen
          name={wrapper.route.WelcomeModal.name}
          component={WelcomePage}
        />
        <ModalStack.Screen
          name={wrapper.route.CreateAccountModal.name}
          component={CreateAccountModal}
        />
        <ModalStack.Screen
          name={wrapper.route.EditAccountModal.name}
          component={EditAccountModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ReceiveWalletSelectionModal.name}
          component={ReceiveWalletSelectionModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ReceiveAccountSelectionModal.name}
          component={ReceiveAccountSelectionModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ReceiveToAccountModal.name}
          component={ReceiveToAccountModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ReceiveQrCodeModal.name}
          component={ReceiveQrCodeModal}
        />
        <ModalStack.Screen
          name={wrapper.route.SendModalStack.name}
          component={SendModalStackNavigation}
        />
        <ModalStack.Screen
          name={wrapper.route.ReceiveModalStack.name}
          component={ReceiveModalStackNavigation}
        />
        <ModalStack.Screen
          name={wrapper.route.CustomColor.name}
          component={CustomColorPage}
        />
        <ModalStack.Screen
          name={wrapper.route.WalletContextModal.name}
          component={WalletContextModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ReorderWalletModal.name}
          component={ReorderWalletModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ListTokenModal.name}
          component={ListTokenModal}
        />
        <ModalStack.Screen
          name={wrapper.route.LanguagePickerModal.name}
          component={LanguagePickerModal}
        />
        <ModalStack.Screen
          name={wrapper.route.CurrencyPickerModal.name}
          component={CurrencyPickerModal}
        />
        <ModalStack.Screen
          name={wrapper.route.ThemePickerModal.name}
          component={ThemePickerModal}
        />
        <ModalStack.Screen
          name={wrapper.route.PersistContact.name}
          component={PersistContact}
        />
        <ModalStack.Screen
          name={wrapper.route.AccountQRCode.name}
          component={AccountQRCode}
        />
        <ModalStack.Screen
          name={wrapper.route.ContactsModal.name}
          component={ContactPicker}
        />
        <ModalStack.Screen
          name={wrapper.route.CopyContextModal.name}
          component={CopyContextModal}
        />
        <ModalStack.Screen
          name={wrapper.route.TransactionDetails.name}
          component={TransactionDetails}
        />
        <ModalStack.Screen
          name={wrapper.route.EditWalletModal.name}
          component={EditWalletModal}
        />
        <ModalStack.Screen
          name={wrapper.route.SecurityModal.name}
          component={SecurityPickerModal}
        />
        <ModalStack.Screen
          name={wrapper.route.TipConfirmationModal.name}
          component={TipConfirmationModal}
        />
        <ModalStack.Screen
          name={wrapper.route.BlockchainListModal.name}
          component={BlockchainListModal}
        />
      </ModalStack.Navigator>
    </ThemeProvider>
  )
}

export default ModalStackNavigation
