import {RoutePath, RoutePathMap} from '~src/app/RoutePath'

/**
 * Route Configuration
 */
export class RouteConfig {
  /**
   * Register all paths here
   */
  readonly pathNames = [
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
  ] as const

  readonly path: RoutePathMap

  constructor() {
    const path: any = {}

    this.pathNames.forEach((it) => {
      path[it] = new RoutePath(it)
    })

    this.path = path
  }
}
