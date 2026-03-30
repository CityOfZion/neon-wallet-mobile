import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useIsFirstTimeSelector } from '@/hooks/useSettingsSelector'

import type { TRootStackParamList } from '@/types/stacks'

const RootNavigator = createNativeStackNavigator<TRootStackParamList>()

export const RootStack = () => {
  const { isFirstTime } = useIsFirstTimeSelector()

  const initialRouteName = isFirstTime ? 'OnboardingScreen' : 'TabStack'

  return (
    <RootNavigator.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, autoHideHomeIndicator: false }}
    >
      <RootNavigator.Screen name="TabStack" getComponent={() => require('../TabStack').TabStack} />

      <RootNavigator.Screen
        name="OnboardingScreen"
        getComponent={() => require('@/routes/screens/OnboardingScreen').OnboardingScreen}
      />
      <RootNavigator.Screen
        name="OnboardingCompletedScreen"
        getComponent={() => require('@/routes/screens/OnboardingCompletedScreen').OnboardingCompletedScreen}
      />

      <RootNavigator.Group
        screenOptions={{
          presentation: 'containedTransparentModal',
          animation: 'none',
          gestureEnabled: false,
        }}
      >
        <RootNavigator.Screen
          name="OnboardingImportModal"
          getComponent={() => require('@/routes/modals/OnboardingImportModal').OnboardingImportModal}
        />
        <RootNavigator.Screen
          name="OnboardingBackupMnemonicModal"
          getComponent={() => require('@/routes/modals/OnboardingBackupMnemonicModal').OnboardingBackupMnemonicModal}
        />
        <RootNavigator.Screen
          name="BlockchainSelectionModal"
          getComponent={() => require('@/routes/modals/BlockchainSelectionModal').BlockchainSelectionModal}
        />
        <RootNavigator.Screen
          name="ChangelogModal"
          getComponent={() => require('@/routes/modals/ChangelogModal').ChangelogModal}
        />
        <RootNavigator.Screen
          name="BackupAlertModal"
          getComponent={() => require('@/routes/modals/BackupAlertModal').BackupAlertModal}
        />
        <RootNavigator.Screen
          name="QRCodeAddressContextModal"
          getComponent={() => require('@/routes/modals/QRCodeAddressContextModal').QRCodeAddressContextModal}
        />
        <RootNavigator.Screen
          name="QuickToolsModal"
          getComponent={() => require('@/routes/modals/QuickToolsModal').QuickToolsModal}
        />
        <RootNavigator.Screen
          name="WalletSelectionModal"
          getComponent={() => require('@/routes/modals/WalletSelectionModal').WalletSelectionModal}
        />

        <RootNavigator.Screen
          name="AccountStackListSelectionModal"
          getComponent={() => require('@/routes/modals/AccountStackListSelectionModal').AccountStackListSelectionModal}
        />
        <RootNavigator.Screen
          name="AccountSelectionModal"
          getComponent={() => require('@/routes/modals/AccountSelectionModal').AccountSelectionModal}
        />
        <RootNavigator.Screen
          name="AddressSelectionModal"
          getComponent={() => require('@/routes/modals/AddressSelectionModal').AddressSelectionModal}
        />
        <RootNavigator.Screen
          name="TokenSelectionModal"
          getComponent={() => require('@/routes/modals/TokenSelectionModal').TokenSelectionModal}
        />

        <RootNavigator.Screen
          name="NetworkUrlSelectionModal"
          getComponent={() => require('@/routes/modals/NetworkUrlSelectionModal').NetworkUrlSelectionModal}
        />
        <RootNavigator.Screen
          name="EditAccountModal"
          getComponent={() => require('@/routes/modals/EditAccountModal').default}
        />
        <RootNavigator.Screen
          name="AccountQRCodeModal"
          getComponent={() => require('@/routes/modals/AccountQRCodeModal').AccountQRCodeModal}
        />
        <RootNavigator.Screen
          name="ExportKeyModal"
          getComponent={() => require('@/routes/modals/ExportKeyModal').ExportKeyModal}
        />
        <RootNavigator.Screen
          name="SendTipUncheckedConfirmationModal"
          getComponent={() =>
            require('@/routes/modals/SendTipUncheckedConfirmationModal').SendTipUncheckedConfirmationModal
          }
        />
        <RootNavigator.Screen
          name="SendConfirmModal"
          getComponent={() => require('@/routes/modals/SendConfirmModal').SendConfirmModal}
        />
        <RootNavigator.Screen
          name="WalletContextModal"
          getComponent={() => require('@/routes/modals/WalletContextModal').WalletContextModal}
        />
        <RootNavigator.Screen
          name="ReorderWalletsModal"
          getComponent={() => require('@/routes/modals/ReorderWalletsModal').ReorderWalletsModal}
        />
        <RootNavigator.Screen
          name="EditWalletModal"
          getComponent={() => require('@/routes/modals/EditWalletModal').EditWalletModal}
        />
        <RootNavigator.Screen
          name="CreateAccountBlockchainSelectionModal"
          getComponent={() =>
            require('@/routes/modals/CreateAccountBlockchainSelectionModal').CreateAccountBlockchainSelectionModal
          }
        />
        <RootNavigator.Screen
          name="CurrencySelectionModal"
          getComponent={() => require('@/routes/modals/CurrencySelectionModal').CurrencySelectionModal}
        />
        <RootNavigator.Screen
          name="LanguageSelectionModal"
          getComponent={() => require('@/routes/modals/LanguageSelectionModal').LanguageSelectionModal}
        />
        <RootNavigator.Screen
          name="SecuritySelectionModal"
          getComponent={() => require('@/routes/modals/SecuritySelectionModal').SecuritySelectionModal}
        />

        <RootNavigator.Screen
          name="PersistNetworkModal"
          getComponent={() => require('@/routes/modals/PersistNetworkModal').PersistNetworkModal}
        />
        <RootNavigator.Screen
          name="PersistContactModal"
          getComponent={() => require('@/routes/modals/PersistContactModal').PersistContactModal}
        />
        <RootNavigator.Screen
          name="PersistContactAddressModal"
          getComponent={() => require('@/routes/modals/PersistContactAddressModal').PersistContactAddressModal}
        />
        <RootNavigator.Screen
          name="DappConnectionModal"
          getComponent={() => require('@/routes/modals/DappConnectionModal').DappConnectionModal}
        />
        <RootNavigator.Screen
          name="DappConnectionRequestModal"
          getComponent={() => require('@/routes/modals/DappConnectionRequestModal').DappConnectionRequestModal}
        />
        <RootNavigator.Screen
          name="DappConnectionDetailsModal"
          getComponent={() => require('@/routes/modals/DappConnectionDetailsModal').DappConnectionDetailsModal}
        />
        <RootNavigator.Screen
          name="DappPermissionModal"
          getComponent={() => require('@/routes/modals/DappPermissionModal').DappPermissionModal}
        />
        <RootNavigator.Screen
          name="DappPermissionContractDetailsModal"
          getComponent={() =>
            require('@/routes/modals/DappPermissionContractDetailsModal').DappPermissionContractDetailsModal
          }
        />
        <RootNavigator.Screen
          name="DappPermissionSignatureScopeModal"
          getComponent={() =>
            require('@/routes/modals/DappPermissionSignatureScopeModal').DappPermissionSignatureScopeModal
          }
        />
        <RootNavigator.Screen
          name="SwapExplanationModal"
          getComponent={() => require('@/routes/modals/SwapExplanationModal').SwapExplanationModal}
        />
        <RootNavigator.Screen
          name="SwapDetailsModal"
          getComponent={() => require('@/routes/modals/SwapDetailsModal').SwapDetailsModal}
        />
        <RootNavigator.Screen
          name="SwapDetailsLogModal"
          getComponent={() => require('@/routes/modals/SwapDetailsLogModal').SwapDetailsLogModal}
        />
        <RootNavigator.Screen
          name="AboutExtraIdToReceiveModal"
          getComponent={() => require('@/routes/modals/AboutExtraIdToReceiveModal').AboutExtraIdToReceiveModal}
        />
        <RootNavigator.Screen
          name="ImportBackupModal"
          getComponent={() => require('@/routes/modals/ImportBackupModal').ImportBackupModal}
        />
        <RootNavigator.Screen
          name="CreateBackupModal"
          getComponent={() => require('@/routes/modals/CreateBackupModal').CreateBackupModal}
        />
        <RootNavigator.Screen
          name="PasswordModal"
          getComponent={() => require('@/routes/modals/PasswordModal').PasswordModal}
        />
        <RootNavigator.Screen
          name="SuccessModal"
          getComponent={() => require('@/routes/modals/SuccessModal').SuccessModal}
        />
        <RootNavigator.Screen name="ErrorModal" getComponent={() => require('@/routes/modals/ErrorModal').ErrorModal} />
        <RootNavigator.Screen
          name="ConnectHardwareTypeSelectionModal"
          getComponent={() =>
            require('@/routes/modals/ConnectHardwareTypeSelectionModal').ConnectHardwareTypeSelectionModal
          }
        />
        <RootNavigator.Screen
          name="ConnectHardwareBluetoothModal"
          getComponent={() => require('@/routes/modals/ConnectHardwareBluetoothModal').ConnectHardwareBluetoothModal}
        />
        <RootNavigator.Screen
          name="ConnectHardwareUsbModal"
          getComponent={() => require('@/routes/modals/ConnectHardwareUsbModal').ConnectHardwareUsbModal}
        />
        <RootNavigator.Screen
          name="BuyAndSellTokensInfoModal"
          getComponent={() => require('@/routes/modals/BuyAndSellTokensInfoModal').BuyAndSellTokensInfoModal}
        />
        <RootNavigator.Screen
          name="BuyAndSellTokensAboutDataModal"
          getComponent={() => require('@/routes/modals/BuyAndSellTokensAboutDataModal').BuyAndSellTokensAboutDataModal}
        />
        <RootNavigator.Screen
          name="BuyAndSellTokensAccountsModal"
          getComponent={() => require('@/routes/modals/BuyAndSellTokensAccountsModal').BuyAndSellTokensAccountsModal}
        />
        <RootNavigator.Screen
          name="SellTokensDepositModal"
          getComponent={() => require('@/routes/modals/SellTokensDepositModal').SellTokensDepositModal}
        />
        <RootNavigator.Screen
          name="SellTokensDepositSuccessModal"
          getComponent={() => require('@/routes/modals/SellTokensDepositSuccessModal').SellTokensDepositSuccessModal}
        />
        <RootNavigator.Screen
          name="NotificationContextModal"
          getComponent={() => require('@/routes/modals/NotificationContextModal').NotificationContextModal}
        />
        <RootNavigator.Screen
          name="AccountAssetTokenActionsModal"
          getComponent={() => require('@/routes/modals/AccountAssetTokenActionsModal').AccountAssetTokenActionsModal}
        />
        <RootNavigator.Screen
          name="AccountAssetActionsModal"
          getComponent={() => require('@/routes/modals/AccountAssetActionsModal').AccountAssetActionsModal}
        />
        <RootNavigator.Screen
          name="ExportFullTransactionsModal"
          getComponent={() => require('@/routes/modals/ExportFullTransactionsModal').ExportFullTransactionsModal}
        />
        <RootNavigator.Screen
          name="DateSelectionModal"
          getComponent={() => require('@/routes/modals/DateSelectionModal').DateSelectionModal}
        />
        <RootNavigator.Screen
          name="VoteNeo3HowItWorksModal"
          getComponent={() => require('@/routes/modals/VoteNeo3HowItWorksModal').VoteNeo3HowItWorksModal}
        />
        <RootNavigator.Screen
          name="VoteNeo3SupportUsModal"
          getComponent={() => require('@/routes/modals/VoteNeo3SupportUsModal').VoteNeo3SupportUsModal}
        />
        <RootNavigator.Screen
          name="VoteNeo3ConfirmationModal"
          getComponent={() => require('@/routes/modals/VoteNeo3ConfirmationModal').VoteNeo3ConfirmationModal}
        />
        <RootNavigator.Screen
          name="VoteNeo3CandidateDetailsModal"
          getComponent={() => require('@/routes/modals/VoteNeo3CandidateDetailsModal').VoteNeo3CandidateDetailsModal}
        />

        <RootNavigator.Screen
          name="CreatePasswordModal"
          getComponent={() => require('@/routes/modals/CreatePasswordModal').CreatePasswordModal}
        />
        <RootNavigator.Screen
          name="RemoveNfiModal"
          getComponent={() => require('@/routes/modals/RemoveNfiModal').RemoveNfiModal}
        />

        <RootNavigator.Screen
          name="HideFraudulentTokenModal"
          getComponent={() => require('@/routes/modals/HideFraudulentTokenModal').HideFraudulentTokenModal}
        />

        <RootNavigator.Screen
          name="ImportAddressSelectionModal"
          getComponent={() => require('@/routes/modals/ImportAddressSelectionModal').ImportAddressSelectionModal}
        />

        <RootNavigator.Screen
          name="ImportEncryptedKeySelectionModal"
          getComponent={() =>
            require('@/routes/modals/ImportEncryptedKeySelectionModal').ImportEncryptedKeySelectionModal
          }
        />

        <RootNavigator.Screen
          name="ImportKeySelectionModal"
          getComponent={() => require('@/routes/modals/ImportKeySelectionModal').ImportKeySelectionModal}
        />

        <RootNavigator.Screen
          name="ImportMnemonicSelectionModal"
          getComponent={() => require('@/routes/modals/ImportMnemonicSelectionModal').ImportMnemonicSelectionModal}
        />

        <RootNavigator.Screen
          name="BridgeNeo3NeoXAboutModal"
          getComponent={() => require('@/routes/modals/BridgeNeo3NeoXAboutModal').BridgeNeo3NeoXAboutModal}
        />
        <RootNavigator.Screen
          name="BridgeNeo3NeoXConfirmationModal"
          getComponent={() =>
            require('@/routes/modals/BridgeNeo3NeoXConfirmationModal').BridgeNeo3NeoXConfirmationModal
          }
        />
        <RootNavigator.Screen
          name="BridgeNeo3NeoXDetailsModal"
          getComponent={() => require('@/routes/modals/BridgeNeo3NeoXDetailsModal').BridgeNeo3NeoXDetailsModal}
        />
        <RootNavigator.Screen
          name="SurveyModal"
          getComponent={() => require('@/routes/modals/SurveyModal').SurveyModal}
        />
      </RootNavigator.Group>
    </RootNavigator.Navigator>
  )
}
