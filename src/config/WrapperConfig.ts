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
    'QuickTools',
    'ListWallets',
    'Contacts',
    'Settings',
    'More',
    'GetWallet',
    'GetAccount',
    'Step1CreateWallet',
    'Step2CreateWallet',
    'Step3CreateWallet',
    'Step4CreateWallet',
    'Step5CreateWallet',
    'CustomColor',
    'ReceiveQrCode',
    'QrCodeScanTest',
    'SampleModal',
    'ReceiveWalletSelectionModal',
    'SendWalletSelectionModal',
    'SendTransactionConfirmationModal',
    'Login',
    'WalletContextModal'
  ] as const
}
