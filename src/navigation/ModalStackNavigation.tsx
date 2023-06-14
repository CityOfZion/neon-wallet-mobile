import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import AccountSelectionModal, { AccountSelectionModalParams } from '../scenes/Account/AccountSelectionModal'
import { ExportWIFModal, ExportWIFModalParams } from '../scenes/Account/ExportWIFModal'
import ReceiveTransactionModal, {
  ReceiveTransactionModalParams,
} from '../scenes/Account/ReceiveTransaction/ReceiveTransactionModal/ReceiveTransactionModal'
import ReceiveTransactionQrCodeModal, {
  ReceiveTransactionQrCodeModalParams,
} from '../scenes/Account/ReceiveTransaction/ReceiveTransactionQrCodeModal'
import SendTransactionConfirmationModal, {
  SendTransactionConfirmationModalParams,
} from '../scenes/Account/SendTransaction/SendTransactionConfirmationModal'
import {
  SendTransactionModal,
  SendTransactionModalParams,
} from '../scenes/Account/SendTransaction/SendTransactionModal/SendTransactionModal'
import {
  SendTransactionReviewModal,
  SendTransactionReviewModalParams,
} from '../scenes/Account/SendTransaction/SendTransactionReviewModal'
import { AddressScanQuickToolsModal, AddressScanQuickToolsModalParams } from '../scenes/AddressScanQuickToolsModal'
import { AddContactAddressModal, AddContactAddressModalParams } from '../scenes/Contacts/AddContactAddressModal'
import { PersistContactModalParams, PersistContactModal } from '../scenes/Contacts/PersistContactModal'
import { SelectChainModal, SelectChainModalParams } from '../scenes/Contacts/SelectChainModal'
import ConfirmPasscodePage, { ConfirmPasscodePageParams } from '../scenes/Settings/ConfirmPasscodePage'
import { EditNetworkModal, EditNetworkModalParams } from '../scenes/Settings/EditNetworkModal'
import PasscodePage, { PasscodePageParams } from '../scenes/Settings/PasscodePage/PasscodePage'
import { BackupInfoModal, BackupInfoModalParams } from '../scenes/Wallet/BackupInfoModal'
import WalletSelectionModal, { WalletSelectionModalParams } from '../scenes/Wallet/WalletSelectionModal'
import WebViewModal, { WebViewModalParams } from '../scenes/WebViewModal'
import WCInvocationDetailsModal, {
  WCInvocationDetailsModalParams,
} from '../scenes/walletConnect/modal/WCInvocationDetailsModal'
import { DefaultNavigationParam } from '../types/global'

import EditAccountModal, { EditAccountModalParam } from '~/src/scenes/Account/EditAccountModal'
import EditWalletModal, { EditWalletParams } from '~/src/scenes/Wallet/EditWalletModal'
import ReorderWalletModal from '~/src/scenes/Wallet/ReorderWalletModal'
import WalletContextModal, { WalletContextModalParams } from '~/src/scenes/Wallet/WalletContextModal'
import { WCConnectDappModal } from '~/src/scenes/walletConnect/modal/WCConnectDappModal'
import RawJsonModal, {
  RawJsonModalParams,
} from '~/src/scenes/walletConnect/modal/WCTransactionRequestModal/RawJsonModal'
import SignatureScopeModal, {
  SignatureScopeModalParams,
} from '~/src/scenes/walletConnect/modal/WCTransactionRequestModal/SignatureScopeModal'
import WCTransactionRequestModal, {
  WCTransactionRequestModalParams,
} from '~/src/scenes/walletConnect/modal/WCTransactionRequestModal/WCTransactionRequestModal'
import { wrapper } from '~src/app/ApplicationWrapper'
import { screenConfig } from '~src/config/ScreenConfig'
import { AccountQRCode, AccountQRCodeParams } from '~src/scenes/Account/AccountQRCode'
import BlockchainListModal, { BlockchainListModalParams } from '~src/scenes/BlockchainListModal'
import ChangelogModal, { ChangelogModalParams } from '~src/scenes/ChangelogModal'
import { ContactPicker, ContactsModalParams } from '~src/scenes/Contacts/ContactPicker'
import CopyContextModal, { CopyContextModalParams } from '~src/scenes/CopyContextModal'
import CurrencyPickerModal from '~src/scenes/CurrencyPickerModal'
import CustomColorPage, { CustomColorPageParam } from '~src/scenes/CustomColorPage'
import LanguagePickerModal from '~src/scenes/LanguagePickerModal'
import ListTokenModal, { ListTokenModalParams } from '~src/scenes/ListTokenModal'
import SecurityPickerModal from '~src/scenes/Settings/SecurityPickerModal'
import VerifyPasscodePage, { VerifyPasscodePageParams } from '~src/scenes/Settings/VerifyPasscodePage'
import ThemePickerModal from '~src/scenes/ThemePickerModal'
import TipConfirmationModal, { TipConfirmationModalParams } from '~src/scenes/TipConfirmationModal'
import WCConnectionDetailsModal, {
  WCConnectionDetailsModalParams,
} from '~src/scenes/walletConnect/modal/WCConnectionDetailsModal'
import WCConnectionRequestModal, {
  WCConnectionRequestModalParams,
} from '~src/scenes/walletConnect/modal/WCConnectionRequestModal'

export type ModalStackParamList = {
  CreateAccountModal: undefined
  EditAccountModal: EditAccountModalParam
  AccountQRCode: AccountQRCodeParams
  CustomColor: CustomColorPageParam
  WalletContextModal: WalletContextModalParams
  ReorderWalletModal: undefined
  ListTokenModal: ListTokenModalParams
  LanguagePickerModal: undefined
  CurrencyPickerModal: undefined
  ThemePickerModal: undefined
  NetworkPickerModal: undefined
  PersistContactModal: PersistContactModalParams
  ContactsModal: ContactsModalParams
  CopyContextModal: CopyContextModalParams
  EditWalletModal: EditWalletParams
  ReceiveModalStack: undefined
  SecurityPickerModal: undefined
  ChangelogModal: ChangelogModalParams
  TipConfirmationModal: TipConfirmationModalParams
  BlockchainListModal: BlockchainListModalParams
  WCConnectionRequestModal: WCConnectionRequestModalParams
  WCConnectDappModal: undefined
  WCTransactionRequestModal: WCTransactionRequestModalParams
  RawJsonModal: RawJsonModalParams
  WCConnectionDetailsModal: WCConnectionDetailsModalParams
  WCInvocationDetailsModal: WCInvocationDetailsModalParams
  SignatureScopeModal: SignatureScopeModalParams
  WebViewModal: WebViewModalParams
  ExportWIFModal: ExportWIFModalParams
  SendTransactionModal: SendTransactionModalParams
  SendTransactionReviewModal: SendTransactionReviewModalParams
  SendTransactionConfirmationModal: SendTransactionConfirmationModalParams
  ReceiveTransactionQrCodeModal: ReceiveTransactionQrCodeModalParams
  ReceiveTransactionModal: ReceiveTransactionModalParams
  AccountSelectionModal: AccountSelectionModalParams
  WalletSelectionModal: WalletSelectionModalParams
  AddressScanQuickToolsModal: AddressScanQuickToolsModalParams
  BackupInfoModal: BackupInfoModalParams
  Passcode: PasscodePageParams
  ConfirmPasscode: ConfirmPasscodePageParams
  VerifyPasscode: VerifyPasscodePageParams
  EditNetworkModal: EditNetworkModalParams
  AddContactAddressModal: AddContactAddressModalParams
  SelectChainModal: SelectChainModalParams
}

// Add here params for modals that you need to navigate directly to, from a different stack
export type ModalParams =
  | DefaultNavigationParam<CustomColorPageParam>
  | DefaultNavigationParam<EditAccountModalParam>
  | DefaultNavigationParam<AccountQRCodeParams>
  | DefaultNavigationParam<ContactsModalParams>
  | DefaultNavigationParam<PersistContactModalParams>
  | DefaultNavigationParam<EditWalletParams>
  | DefaultNavigationParam<ChangelogModalParams>
  | DefaultNavigationParam<WalletContextModalParams>
  | DefaultNavigationParam<BlockchainListModalParams>
  | DefaultNavigationParam<WCConnectionRequestModalParams>
  | DefaultNavigationParam<WCTransactionRequestModalParams>
  | DefaultNavigationParam<RawJsonModalParams>
  | DefaultNavigationParam<WCConnectionDetailsModalParams>
  | DefaultNavigationParam<WCInvocationDetailsModalParams>
  | DefaultNavigationParam<RawJsonModalParams>
  | DefaultNavigationParam<SignatureScopeModalParams>
  | DefaultNavigationParam<WCInvocationDetailsModalParams>
  | DefaultNavigationParam<WebViewModalParams>
  | DefaultNavigationParam<ExportWIFModalParams>
  | DefaultNavigationParam<TipConfirmationModalParams>
  | DefaultNavigationParam<SendTransactionModalParams>
  | DefaultNavigationParam<SendTransactionReviewModalParams>
  | DefaultNavigationParam<SendTransactionConfirmationModalParams>
  | DefaultNavigationParam<ReceiveTransactionModalParams>
  | DefaultNavigationParam<AccountSelectionModalParams>
  | DefaultNavigationParam<ReceiveTransactionQrCodeModalParams>
  | DefaultNavigationParam<WalletSelectionModalParams>
  | DefaultNavigationParam<AddressScanQuickToolsModalParams>
  | DefaultNavigationParam<PasscodePageParams>
  | DefaultNavigationParam<ConfirmPasscodePageParams>
  | DefaultNavigationParam<VerifyPasscodePageParams>
  | DefaultNavigationParam<BackupInfoModalParams>
  | DefaultNavigationParam<AddContactAddressModalParams>
  | DefaultNavigationParam<SelectChainModalParams>
  | DefaultNavigationParam<EditNetworkModalParams>

const ModalStack = createStackNavigator<ModalStackParamList>()

const ModalStackNavigation = () => {
  return (
    <ModalStack.Navigator headerMode="none" screenOptions={screenConfig}>
      <ModalStack.Screen name={wrapper.route.AddressScanQuickToolsModal.name} component={AddressScanQuickToolsModal} />
      <ModalStack.Screen name={wrapper.route.ChangelogModal.name} component={ChangelogModal} />
      <ModalStack.Screen name={wrapper.route.EditAccountModal.name} component={EditAccountModal} />
      <ModalStack.Screen name={wrapper.route.CustomColor.name} component={CustomColorPage} />
      <ModalStack.Screen name={wrapper.route.WalletContextModal.name} component={WalletContextModal} />
      <ModalStack.Screen name={wrapper.route.ReorderWalletModal.name} component={ReorderWalletModal} />
      <ModalStack.Screen name={wrapper.route.ListTokenModal.name} component={ListTokenModal} />
      <ModalStack.Screen name={wrapper.route.LanguagePickerModal.name} component={LanguagePickerModal} />
      <ModalStack.Screen name={wrapper.route.CurrencyPickerModal.name} component={CurrencyPickerModal} />
      <ModalStack.Screen name={wrapper.route.ThemePickerModal.name} component={ThemePickerModal} />
      <ModalStack.Screen name={wrapper.route.PersistContactModal.name} component={PersistContactModal} />
      <ModalStack.Screen name={wrapper.route.AccountQRCode.name} component={AccountQRCode} />
      <ModalStack.Screen name={wrapper.route.ContactsModal.name} component={ContactPicker} />
      <ModalStack.Screen name={wrapper.route.CopyContextModal.name} component={CopyContextModal} />
      <ModalStack.Screen name={wrapper.route.EditWalletModal.name} component={EditWalletModal} />
      <ModalStack.Screen name={wrapper.route.SecurityPickerModal.name} component={SecurityPickerModal} />
      <ModalStack.Screen name={wrapper.route.TipConfirmationModal.name} component={TipConfirmationModal} />
      <ModalStack.Screen name={wrapper.route.BlockchainListModal.name} component={BlockchainListModal} />
      <ModalStack.Screen name={wrapper.route.WCConnectionRequestModal.name} component={WCConnectionRequestModal} />
      <ModalStack.Screen name={wrapper.route.WCConnectDappModal.name} component={WCConnectDappModal} />
      <ModalStack.Screen name={wrapper.route.WCTransactionRequestModal.name} component={WCTransactionRequestModal} />
      <ModalStack.Screen name={wrapper.route.RawJsonModal.name} component={RawJsonModal} />
      <ModalStack.Screen name={wrapper.route.WCConnectionDetailsModal.name} component={WCConnectionDetailsModal} />
      <ModalStack.Screen name={wrapper.route.SignatureScopeModal.name} component={SignatureScopeModal} />
      <ModalStack.Screen name={wrapper.route.WCInvocationDetailsModal.name} component={WCInvocationDetailsModal} />
      <ModalStack.Screen name={wrapper.route.WebViewModal.name} component={WebViewModal} />
      <ModalStack.Screen name={wrapper.route.ExportWIFModal.name} component={ExportWIFModal} />
      <ModalStack.Screen name={wrapper.route.SendTransactionModal.name} component={SendTransactionModal} />
      <ModalStack.Screen name={wrapper.route.SendTransactionReviewModal.name} component={SendTransactionReviewModal} />
      <ModalStack.Screen
        name={wrapper.route.SendTransactionConfirmationModal.name}
        component={SendTransactionConfirmationModal}
      />
      <ModalStack.Screen name={wrapper.route.WalletSelectionModal.name} component={WalletSelectionModal} />
      <ModalStack.Screen name={wrapper.route.AccountSelectionModal.name} component={AccountSelectionModal} />
      <ModalStack.Screen name={wrapper.route.ReceiveTransactionModal.name} component={ReceiveTransactionModal} />
      <ModalStack.Screen
        name={wrapper.route.ReceiveTransactionQrCodeModal.name}
        component={ReceiveTransactionQrCodeModal}
      />
      <ModalStack.Screen name={wrapper.route.BackupInfoModal.name} component={BackupInfoModal} />
      <ModalStack.Screen name={wrapper.route.Passcode.name} component={PasscodePage} />
      <ModalStack.Screen name={wrapper.route.ConfirmPasscode.name} component={ConfirmPasscodePage} />
      <ModalStack.Screen name={wrapper.route.VerifyPasscode.name} component={VerifyPasscodePage} />
      <ModalStack.Screen name={wrapper.route.EditNetworkModal.name} component={EditNetworkModal} />
      <ModalStack.Screen name={wrapper.route.AddContactAddressModal.name} component={AddContactAddressModal} />
      <ModalStack.Screen name={wrapper.route.SelectChainModal.name} component={SelectChainModal} />
    </ModalStack.Navigator>
  )
}

export default ModalStackNavigation
