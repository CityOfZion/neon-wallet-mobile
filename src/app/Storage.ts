import {Facade} from '~src/app/Facade'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
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
   * Controls the span of welcome to neonwallet screen
   */
  static get welcomeToNWSeen() {
    return Facade.storage['@welcome_to_nw_seen'].bind().asBoolean()
  }

  /**
   * Controls the span of welcome screen
   */
  static get welcomeHidden() {
    return Facade.storage['@welcome_hidden'].bind().asBoolean()
  }

  /**
   * Controls the span of changelog screen
   */
  static get changelogHidden() {
    return Facade.storage['@changelog_hidden'].bind().asBoolean()
  }

  /**
   * Controls the number of versions
   */
  static get numberOfVersions() {
    return Facade.storage['@number_of_versions'].bind().asNumber()
  }

  /**
   * Controls if authentication was set up
   */
  static get hasAuthentication() {
    return Facade.storage['@has_authentication'].bind().asBoolean()
  }

  /**
   * Controls if authentication for hardware was set up
   */
  static get hasAuthenticationForHardware() {
    return Facade.storage['@has_authentication_hard'].bind().asBoolean()
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

  /**
   * User contacts
   */
  static get contacts() {
    return Facade.storage['@contacts'].bind().asArrayOf(Contact)
  }
}
