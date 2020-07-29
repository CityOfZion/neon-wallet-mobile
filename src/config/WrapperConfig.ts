/**
 * Wrapper Configuration
 */
import {DarkTheme} from '~src/themes/DarkTheme'
import {LightTheme} from '~src/themes/LightTheme'

export class WrapperConfig {
  readonly themes = [DarkTheme, LightTheme] as const

  readonly dataKeys = [
    '@onboarding_seen',
    '@welcome_hidden',
    '@settings',
    '@wallets',
    '@accounts',
  ] as const

  readonly routes = [
    'Modal',
    'Tab',
    'Onboarding',
    'WelcomeModal',
    'QuickTools',
    'ListWallets',
    'Contacts',
    'Settings',
    'More',
    'GetWallet',
    'GetAccount',
    'MyWallets',
    'MyWalletOptions',
    'MorePage',
    'Step1CreateWallet',
    'Step2CreateWallet',
    'Step3CreateWallet',
    'Step4CreateWallet',
    'Step5CreateWallet',
    'Step1BackupWallet',
    'Step2BackupWallet',
    'Step3BackupWallet',
    'CustomColor',
    'ReceiveQrCode',
    'CreateAccountModal',
    'EditAccountModal',
    'QRCodeScan',
    'ReceiveWalletSelectionModal',
    'ReceiveAccountSelectionModal',
    'ReceiveToAccountModal',
    'SendWalletSelectionModal',
    'SendAccountSelectionModal',
    'SendTransactionInputModal',
    'SendTransactionReviewModal',
    'SendTransactionConfirmationModal',
    'Login',
    'WalletContextModal',
    'AccountAssetDetail',
    'ReorderWalletModal',
    'Passcode',
    'ConfirmPasscode',
    'ImportKey',
    'Passphrase',
    'ImportReadAccount',
    'CustomizeAccount',
    'ListTokenModal',
    'LanguagePickerModal',
    'CurrencyPickerModal',
    'ThemePickerModal',
    'AddContact',
    'ContactDetails',
    'AccountQRCode',
  ] as const
}
