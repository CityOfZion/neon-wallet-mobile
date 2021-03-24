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
                    path: 'import_key/:key',
                  },
                  [Facade.route.ImportReadAccount.name]: {
                    path: 'import_address/:address',
                  },
                },
              },
              [Facade.route.ListWallets.name]: {
                initialRouteName: Facade.route.ListWalletsPage.name,
                screens: {
                  [Facade.route.ListWalletsPage.name]:
                    Facade.route.ListWalletsPage.name,
                  [Facade.route.GetAccount.name]: {
                    path: 'send',
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
  static playloadIsAccount(
    playload: PlayContact | PlayAccount | PlayTransaction
  ) {
    let isAccount = false
    function setIsAcount(value: boolean) {
      if (!isAccount) {
        isAccount = value
      }
    }
    const accountFields = ['address', 'private_key', 'encrypted_key']
    const p = playload as PlayAccount
    if (p !== undefined) {
      accountFields.forEach((field) =>
        field in p ? setIsAcount(true) : setIsAcount(false)
      )
    }
    return isAccount
  }
}
