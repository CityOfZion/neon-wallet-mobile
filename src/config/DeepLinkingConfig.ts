import { getStateFromPath, LinkingOptions } from '@react-navigation/native'

import { WalletConnectHelper } from '../helpers/WalletConnectHelper'

import { wrapper } from '~src/app/ApplicationWrapper'

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neon://', 'www.welcome.neo.org/', 'www.neo.coz.io/'],
      config: {
        screens: {
          [wrapper.route.Tab.name]: {
            screens: {
              [wrapper.route.More.name]: {
                initialRouteName: wrapper.route.MorePage.name,
                screens: {
                  [wrapper.route.MorePage.name]: wrapper.route.MorePage.name,
                  [wrapper.route.ImportKey.name]: {
                    path: 'import_key/:data',
                  },
                  [wrapper.route.ImportReadAccount.name]: {
                    path: 'import_address/:address',
                  },
                },
              },
              [wrapper.route.WalletConnectPage.name]: wrapper.route.WalletConnectPage.name,
            },
          },
          [wrapper.route.Modal.name]: {
            screens: {
              [wrapper.route.AddressScanQuickToolsModal.name]: {
                path: 'address/:address',
              },
              [wrapper.route.WCConnectionRequestModal.name]: {
                path: 'uri/:uri/',
                parse: {
                  uri: uri => WalletConnectHelper.convertAndValidateBase64(uri),
                },
              },
              [wrapper.route.WalletSelectionModal.name]: wrapper.route.WalletSelectionModal.name,
            },
          },
        },
      },
      getStateFromPath: (path, options) => {
        if (path.startsWith('collect?wif=')) {
          const [, wif] = path.split('=')
          const routeState = getStateFromPath(`import_key/${wif}`, {
            screens: {
              [wrapper.route.Tab.name]: {
                screens: {
                  [wrapper.route.More.name]: {
                    initialRouteName: wrapper.route.MorePage.name,
                    screens: {
                      [wrapper.route.MorePage.name]: wrapper.route.MorePage.name,
                      [wrapper.route.ImportKey.name]: {
                        path: 'import_key/:data',
                      },
                    },
                  },
                },
              },
            },
          })

          return routeState
        }
        if (!path.startsWith('uri=')) return getStateFromPath(path, options)

        const [, uri] = path.split('=')

        const routeState = getStateFromPath(`uri/${uri}`, {
          screens: {
            [wrapper.route.Tab.name]: {
              screens: {
                [wrapper.route.WalletConnect.name]: {
                  screens: {
                    [wrapper.route.WalletConnectPage.name]: {
                      path: 'uri/:uri',
                      parse: {
                        uri: uri => WalletConnectHelper.convertAndValidateBase64(uri),
                      },
                    },
                  },
                },
              },
            },
          },
        })

        return routeState
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
