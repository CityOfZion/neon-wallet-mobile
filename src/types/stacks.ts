import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import type {
  TAccountAssetActionsModalParams,
  TAccountAssetTokenActionsModalParams,
  TAccountQRCodeModalParams,
  TAccountSelectionModalParams,
  TAccountStackListSelectionModalParams,
  TAccountTransactionsContextModalParams,
  TAccountTransactionsUtxoDetailsModalParams,
  TAddressSelectionModalParams,
  TBackupAlertModalParams,
  TBlockchainSelectionModalParams,
  TBuyAndSellTokensAccountsModalParams,
  TCreateAccountBlockchainSelectionModalParams,
  TCreatePasswordModalParams,
  TDappConnectionDetailsModalParams,
  TDappConnectionModalParams,
  TDappConnectionRequestModalParams,
  TDappPermissionContractDetailsModalParams,
  TDappPermissionModalParams,
  TDappPermissionSignatureScopeModalParams,
  TDateSelectionModalParams,
  TEditAccountModalParams,
  TEditWalletModalParams,
  TErrorModalParams,
  TExportFullTransactionsModalParams,
  TExportKeyModalParams,
  THideFraudulentTokenModalParams,
  TImportAddressSelectionModalParams,
  TImportEncryptedKeySelectionModalParams,
  TImportKeySelectionModalParams,
  TImportMnemonicSelectionModalParams,
  TNeo3NeoXBridgeConfirmationModalParams,
  TNeo3NeoXBridgeDetailsModalParams,
  TNeo3VoteCandidateDetailsModalParams,
  TNeo3VoteConfirmationModalParams,
  TNeo3VoteSupportUsModalParams,
  TNetworkUrlSelectionModalParams,
  TNotificationContextModalParams,
  TOnboardingBackupMnemonicModalParams,
  TOnboardingImportModalParams,
  TPasswordModalParams,
  TPersistContactAddressModalParams,
  TPersistContactModalParams,
  TPersistNetworkModalParams,
  TQRCodeAddressContextModalParams,
  TRemoveNfiModalParams,
  TSellTokensDepositModalParams,
  TSellTokensDepositSuccessModalParams,
  TSendConfirmModalParams,
  TSendTipUncheckedConfirmationModalParams,
  TStellarPersistTrustlineModalParams,
  TStellarTrustilneTokenSelectionModalParams,
  TSuccessModalParams,
  TSwapDetailsLogModalParams,
  TSwapDetailsModalParams,
  TTokenSelectionModalParams,
  TWalletContextModalParams,
  TWalletSelectionModalParams,
} from './modals'
import type {
  TAccountAssetsScreenParams,
  TAccountConnectionsScreenParams,
  TAccountNftsScreenParams,
  TAccountScreenParams,
  TAccountSettingsScreenParams,
  TAccountTransactionsScreenParams,
  TBuyAndSellTokensScreenParams,
  TContactScreenParams,
  TCreateWalletStep3ScreenParams,
  TCreateWalletStep4ScreenParams,
  TCreateWalletStep5ScreenParams,
  TCreateWalletStep6ScreenParams,
  TDappConnectionsScreenParams,
  TImportScreen,
  TMoreScreenParams,
  TNeo3NeoXBridgeScreenParams,
  TNeo3VoteScreenParams,
  TOnboardingCompletedScreenParams,
  TReceiveScreenParams,
  TSendScreenParams,
  TSettingsGeneralScreenParams,
  TSettingsProtocolEditScreen,
  TSettingsScreenParams,
  TSettingsWalletBackupStep1ScreenParams,
  TSettingsWalletBackupStep2ScreenParams,
  TSettingsWalletBackupStep3ScreenParams,
  TStellarTrustlineScreenParams,
  TSwapScreenParams,
  TWalletScreenParams,
  TWalletSettingsScreenParams,
  TWalletsScreenParams,
} from './screens'

export type TWalletsStackParamList = {
  WalletsScreen: TWalletsScreenParams | undefined
  WalletScreen: TWalletScreenParams
  WalletSettingsScreen: TWalletSettingsScreenParams
  AccountScreen: TAccountScreenParams
  AccountAssetsScreen: TAccountAssetsScreenParams
  AccountTransactionsScreen: TAccountTransactionsScreenParams
  AccountConnectionsScreen: TAccountConnectionsScreenParams
  AccountNftsScreen: TAccountNftsScreenParams
  AccountSettingsScreen: TAccountSettingsScreenParams
  SendScreen: TSendScreenParams | undefined
  SwapScreen: TSwapScreenParams | undefined
  BuyAndSellTokensScreen: TBuyAndSellTokensScreenParams | undefined
  Neo3VoteScreen: TNeo3VoteScreenParams
  Neo3NeoXBridgeScreen: TNeo3NeoXBridgeScreenParams
  ReceiveScreen: TReceiveScreenParams | undefined
  StellarTrustlineScreen: TStellarTrustlineScreenParams
}

export type TWalletsStackScreenProps<T extends keyof TWalletsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TWalletsStackParamList, T>,
  TTabStackScreenProps<keyof TTabStackParamList>
>

export type TDappConnectionsStackParamList = {
  DappConnectionsScreen: TDappConnectionsScreenParams | undefined
}

export type TDappConnectionsStackScreenProps<T extends keyof TDappConnectionsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TDappConnectionsStackParamList, T>,
  TTabStackScreenProps<keyof TTabStackParamList>
>

export type TSearchStackParamList = {
  SearchScreen: undefined
}

export type TSearchStackScreenProps<T extends keyof TSearchStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TSearchStackParamList, T>,
  TTabStackScreenProps<keyof TTabStackParamList>
>

export type TMoreStackParamList = {
  MoreScreen?: TMoreScreenParams
  CreateWalletStep1Screen: undefined
  CreateWalletStep2Screen: undefined
  CreateWalletStep3Screen: TCreateWalletStep3ScreenParams
  CreateWalletStep4Screen: TCreateWalletStep4ScreenParams
  CreateWalletStep5Screen: TCreateWalletStep5ScreenParams
  CreateWalletStep6Screen: TCreateWalletStep6ScreenParams
  ImportScreen: TImportScreen | undefined
  SettingsScreen?: TSettingsScreenParams
  SettingsGeneralScreen: TSettingsGeneralScreenParams
  SettingsSecurityBackupScreen: undefined
  SettingsProtocolEditScreen: TSettingsProtocolEditScreen
  SettingsProtocolsScreen: undefined
  SettingsWalletBackupStep1Screen: TSettingsWalletBackupStep1ScreenParams
  SettingsWalletBackupStep2Screen: TSettingsWalletBackupStep2ScreenParams
  SettingsWalletBackupStep3Screen: TSettingsWalletBackupStep3ScreenParams
  NotificationsScreen: undefined
  SupportTicketScreen: undefined
  SupportTicketSuccessScreen: undefined

  ContactsScreen: undefined
  ContactScreen: TContactScreenParams
}

export type TMoreStackScreenProps<T extends keyof TMoreStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TMoreStackParamList, T>,
  TTabStackScreenProps<keyof TTabStackParamList>
>

export type TTabStackParamList = {
  WalletsStack: NavigatorScreenParams<TWalletsStackParamList>
  SearchStack: NavigatorScreenParams<TSearchStackParamList>
  MoreStack: NavigatorScreenParams<TMoreStackParamList>
  DappConnectStack: NavigatorScreenParams<TDappConnectionsStackParamList>
}

export type TTabStackScreenProps<T extends keyof TTabStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<TTabStackParamList, T>,
  TRootStackScreenProps<keyof TRootStackParamList>
>

export type TRootStackParamList = {
  TabStack: NavigatorScreenParams<TTabStackParamList>
  OnboardingScreen: undefined
  OnboardingCompletedScreen: TOnboardingCompletedScreenParams | undefined
  OnboardingImportModal: TOnboardingImportModalParams

  OnboardingBackupMnemonicModal: TOnboardingBackupMnemonicModalParams
  QRCodeAddressContextModal: TQRCodeAddressContextModalParams
  QuickToolsModal: undefined
  BlockchainSelectionModal: TBlockchainSelectionModalParams
  ChangelogModal: undefined
  BackupAlertModal: TBackupAlertModalParams
  AccountStackListSelectionModal: TAccountStackListSelectionModalParams
  AccountSelectionModal: TAccountSelectionModalParams
  AddressSelectionModal: TAddressSelectionModalParams
  WalletSelectionModal: TWalletSelectionModalParams
  TokenSelectionModal: TTokenSelectionModalParams
  NetworkUrlSelectionModal: TNetworkUrlSelectionModalParams

  EditAccountModal: TEditAccountModalParams
  AccountQRCodeModal: TAccountQRCodeModalParams
  ExportKeyModal: TExportKeyModalParams
  SendConfirmModal: TSendConfirmModalParams
  SendTipUncheckedConfirmationModal: TSendTipUncheckedConfirmationModalParams
  WalletContextModal: TWalletContextModalParams
  ReorderWalletsModal: undefined
  EditWalletModal: TEditWalletModalParams
  CreateAccountBlockchainSelectionModal: TCreateAccountBlockchainSelectionModalParams

  CurrencySelectionModal: undefined
  LanguageSelectionModal: undefined
  SecuritySelectionModal: undefined
  PersistNetworkModal: TPersistNetworkModalParams

  PersistContactModal: TPersistContactModalParams | undefined
  PersistContactAddressModal: TPersistContactAddressModalParams | undefined

  DappConnectionModal: TDappConnectionModalParams | undefined
  DappConnectionRequestModal: TDappConnectionRequestModalParams
  DappConnectionDetailsModal: TDappConnectionDetailsModalParams
  DappPermissionModal: TDappPermissionModalParams
  DappPermissionContractDetailsModal: TDappPermissionContractDetailsModalParams
  DappPermissionSignatureScopeModal: TDappPermissionSignatureScopeModalParams

  SwapExplanationModal: undefined
  SwapDetailsModal: TSwapDetailsModalParams
  SwapDetailsLogModal: TSwapDetailsLogModalParams
  AboutExtraIdToReceiveModal: undefined

  ImportBackupModal: undefined
  CreateBackupModal: undefined
  PasswordModal: TPasswordModalParams
  CreatePasswordModal: TCreatePasswordModalParams
  SuccessModal: TSuccessModalParams
  ErrorModal: TErrorModalParams

  ConnectHardwareTypeSelectionModal: undefined
  ConnectHardwareBluetoothModal: undefined
  ConnectHardwareUsbModal: undefined

  BuyAndSellTokensInfoModal: undefined
  BuyAndSellTokensAboutDataModal: undefined
  BuyAndSellTokensAccountsModal: TBuyAndSellTokensAccountsModalParams

  SellTokensDepositModal: TSellTokensDepositModalParams
  SellTokensDepositSuccessModal: TSellTokensDepositSuccessModalParams

  NotificationContextModal: TNotificationContextModalParams

  AccountTransactionsContextModal: TAccountTransactionsContextModalParams
  AccountTransactionsUtxoDetailsModal: TAccountTransactionsUtxoDetailsModalParams

  AccountAssetTokenActionsModal: TAccountAssetTokenActionsModalParams
  AccountAssetActionsModal: TAccountAssetActionsModalParams

  ExportFullTransactionsModal?: TExportFullTransactionsModalParams

  DateSelectionModal: TDateSelectionModalParams

  Neo3VoteHowItWorksModal: undefined
  Neo3VoteSupportUsModal: TNeo3VoteSupportUsModalParams
  Neo3VoteConfirmationModal: TNeo3VoteConfirmationModalParams
  Neo3VoteCandidateDetailsModal: TNeo3VoteCandidateDetailsModalParams

  RemoveNfiModal: TRemoveNfiModalParams

  HideFraudulentTokenModal: THideFraudulentTokenModalParams

  ImportAddressSelectionModal: TImportAddressSelectionModalParams
  ImportEncryptedKeySelectionModal: TImportEncryptedKeySelectionModalParams
  ImportKeySelectionModal: TImportKeySelectionModalParams
  ImportMnemonicSelectionModal: TImportMnemonicSelectionModalParams

  Neo3NeoXBridgeAboutModal: undefined
  Neo3NeoXBridgeConfirmationModal: TNeo3NeoXBridgeConfirmationModalParams
  Neo3NeoXBridgeDetailsModal: TNeo3NeoXBridgeDetailsModalParams

  SurveyModal: undefined

  StellarPersistTrustlineModal: TStellarPersistTrustlineModalParams
  StellarTrustilneTokenSelectionModal: TStellarTrustilneTokenSelectionModalParams
}

export type TRootStackScreenProps<T extends keyof TRootStackParamList> = NativeStackScreenProps<TRootStackParamList, T>

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends TRootStackParamList {}
  }
}
