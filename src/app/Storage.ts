import { wrapper } from './ApplicationWrapper'

export abstract class Storage {
  /**
   * Controls the number of versions
   */
  static get numberOfVersions() {
    return wrapper.storage['@number_of_versions'].bind().asNumber()
  }

  /**
   * Settings' user data
   */
  static get settings() {
    return wrapper.storage['@settings'].bind().as()
  }

  /**
   * Wallets' user data
   */
  static get wallets() {
    return wrapper.storage['@wallets'].bind().as()
  }

  /**
   * Accounts' user data
   */
  static get accounts() {
    return wrapper.storage['@accounts'].bind().as()
  }

  /**
   * User contacts
   */
  static get contacts() {
    return wrapper.storage['@contacts'].bind().asArrayOf()
  }
}
