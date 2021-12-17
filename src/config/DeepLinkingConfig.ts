import {
  LinkingOptions,
  PathConfig,
  PathConfigMap,
} from '@react-navigation/native'

import {wrapper} from '~src/app/ApplicationWrapper'

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neon://', 'nep9://'],
      config: {
        screens: {
          Tab: {
            screens: {
              [wrapper.route.More.name]: {
                initialRouteName: wrapper.route.MorePage.name,
                screens: {
                  [wrapper.route.MorePage.name]: wrapper.route.MorePage.name,
                  [wrapper.route.ImportKey.name]: {
                    path: 'import_key/:key',
                  },
                  [wrapper.route.ImportReadAccount.name]: {
                    path: 'import_address/:address',
                  },
                },
              },
              [wrapper.route.ListWallets.name]: {
                initialRouteName: wrapper.route.ListWalletsPage.name,
                screens: {
                  [wrapper.route.ListWalletsPage.name]:
                    wrapper.route.ListWalletsPage.name,
                  [wrapper.route.GetAccount.name]: {
                    path: 'send',
                  },
                },
              },
            },
          },
          [wrapper.route.QRCodeScan.name]: {
            initialRouteName: 'Tab',
            screens: {
              Tab: 'Tab',
              [wrapper.route.QRCodeScan.name]: {
                path: 'address/:address?',
              },
            },
          },
        },
      },
    }
  }
  setInitialRoute(initialRoute: string) {
    if (this.linkingConfig.config) {
      this.linkingConfig.config.initialRouteName = initialRoute
    }
  }
  getLinkingConfig() {
    return this.linkingConfig
  }
}
