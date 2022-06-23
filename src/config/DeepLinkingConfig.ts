import { getStateFromPath, LinkingOptions } from '@react-navigation/native'

import { wrapper } from '~src/app/ApplicationWrapper'

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neon://', 'nep9://', 'wc://'],
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
              [wrapper.route.WalletConnectPage.name]: {
                initialRouteName: wrapper.route.WalletConnectPage.name,
                screens: {
                  [wrapper.route.WalletConnectPage.name]: {
                    path: 'uri/:uri',
                  },
                },
              },
              [wrapper.route.ListWallets.name]: {
                initialRouteName: wrapper.route.ListWalletsPage.name,
                screens: {
                  [wrapper.route.ListWalletsPage.name]: wrapper.route.ListWalletsPage.name,
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
      getStateFromPath: (path, options) => {
        if (path.includes('uri')) {
          const [, paramUri] = path.split('=')
          return {
            routes: [
              {
                name: wrapper.route.Tab.name,
                state: {
                  routes: [
                    {
                      name: wrapper.route.WalletConnectPage.name,
                      params: { uri: paramUri },
                      state: {
                        routes: [
                          {
                            name: wrapper.route.WalletConnectPage.name,
                            params: { uri: paramUri },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          }
        }
        return getStateFromPath(path, options)
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
