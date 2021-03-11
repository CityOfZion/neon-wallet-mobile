import {
  LinkingOptions,
  PathConfig,
  PathConfigMap,
} from '@react-navigation/native'

import {Facade} from '~src/app/Facade'

function toLowerCaseObjectKeys<T>(obj: {[key: string]: T}): {[key: string]: T} {
  const result: {[key: string]: T} = {}

  for (const [key, value] of Object.entries(obj)) {
    result[key.toLowerCase()] = value
  }

  return result
}

const linkingTab: PathConfig = {
  path: 'Tab',
  screens: {
    [Facade.route.ListWallets.name]: Facade.route.ListWallets.name,
    [Facade.route.Contacts.name]: Facade.route.Contacts.name,
    [Facade.route.QuickTools.name]: Facade.route.QuickTools.name,
    [Facade.route.Settings.name]: Facade.route.Settings.name,
    [Facade.route.More.name]: Facade.route.More.name,
  },
}

export class DeepLinkingConfig {
  linkingConfig: LinkingOptions

  constructor() {
    this.linkingConfig = {
      prefixes: ['neonwallet://app'],
      config: {
        screens: {
          [Facade.route.Onboarding.name]: Facade.route.Onboarding.name,
          [Facade.route.QRCodeScan.name]: Facade.route.QRCodeScan.name,
          [Facade.route.Login.name]: Facade.route.Login.name,
          [Facade.route.PasscodeStack.name]: Facade.route.PasscodeStack.name,
          [Facade.route.Modal.name]: Facade.route.Modal.name,
          Tab: linkingTab,
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
