import {
  LinkingOptions,
  PathConfig,
  PathConfigMap,
} from '@react-navigation/native'

import {Facade} from '~src/app/Facade'

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neon://', 'nep9://'],
      config: {
        screens: {
          Tab: {
            screens: {
              [Facade.route.More.name]: {
                initialRouteName: Facade.route.MorePage.name,
                screens: {
                  [Facade.route.MorePage.name]: Facade.route.MorePage.name,
                  [Facade.route.ImportKey.name]: {
                    path: 'import_wallet/:address?',
                  },
                },
              },
            },
          },
          [Facade.route.QRCodeScan.name]: {
            initialRouteName: 'Tab',
            screens: {
              Tab: 'Tab',
              [Facade.route.QRCodeScan.name]: {
                path: 'read_address/:address?',
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
