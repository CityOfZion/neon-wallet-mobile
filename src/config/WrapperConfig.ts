/**
 * Wrapper Configuration
 */
import {DarkTheme} from '~src/themes/DarkTheme'
import {LightTheme} from '~src/themes/LightTheme'

export class WrapperConfig {
  readonly themes = [DarkTheme, LightTheme] as const

  readonly dataKeys = [
    '@language',
    '@currency',
    '@theme',
    '@onboarding_seen',
    '@welcome_hidden',
    '@account',
    '@wallets',
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
    'QrCodeScanTest',
    'SampleModal',
    'ReceiveWalletSelectionModal',
    'SendWalletSelectionModal',
    'SendTransactionReviewModal',
    'SendTransactionInputModal',
    'SendTransactionConfirmationModal',
    'Login',
    'WalletContextModal',
    'AccountAssetDetail',
    'ReoderWalletModal',
    'Passcode',
    'ConfirmPasscode',
    'ImportKey',
    'Passphrase',
    'ImportReadAccount',
    'CustomizeAccount',
  ] as const
}
