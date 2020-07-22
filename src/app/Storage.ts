import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/redux/Account'
import {Settings} from '~src/models/redux/Settings'
import {Wallet} from '~src/models/redux/Wallet'

export abstract class Storage {
  /**
   * Controls the span of onboarding screen
   */
  static get onboardingSeen() {
    return Facade.storage['@onboarding_seen'].bind().asBoolean()
  }

  /**
   * Controls the span of welcome screen
   */
  static get welcomeHidden() {
    return Facade.storage['@welcome_hidden'].bind().asBoolean()
  }

  /**
   * Settings' user data
   */
  static get settings() {
    return Facade.storage['@settings'].bind().as(Settings)
  }

  /**
   * Wallets' user data
   */
  static get wallets() {
    return Facade.storage['@wallets'].bind().asArrayOf(Wallet)
  }

  /**
   * Accounts' user data
   */
  static get accounts() {
    return Facade.storage['@accounts'].bind().asArrayOf(Account)
  }
}
