import { getStateFromPath, LinkingOptions } from '@react-navigation/native'

import { WalletConnectHelper } from '../helpers/WalletConnectHelper'

import { wrapper } from '~src/app/ApplicationWrapper'

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neon://', 'nep9://', 'wc://'],
      config: {
        screens: {
          [wrapper.route.Tab.name]: {
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
            },
          },
          [wrapper.route.Modal.name]: {
            screens: {
              [wrapper.route.AddressScanQuickToolsModal.name]: {
                path: 'address/:address',
              },
            },
          },
        },
      },
      getStateFromPath: (path, options) => {
        if (!path.startsWith('uri=')) return getStateFromPath(path, options)

        const [, uri] = path.split('=')

        const convertedUri = WalletConnectHelper.convertAndValidateBase64(uri)
        if (!convertedUri) return getStateFromPath(path, options)

        return {
          routes: [
            {
              name: wrapper.route.Tab.name,
              state: {
                routes: [
                  {
                    name: wrapper.route.WalletConnectPage.name,
                  },
                ],
              },
            },
            {
              name: wrapper.route.Modal.name,
              state: {
                routes: [
                  {
                    name: wrapper.route.WCConnectionRequestModal.name,
                    params: {
                      uri: convertedUri,
                    },
                  },
                ],
              },
            },
          ],
        }
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
