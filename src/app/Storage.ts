import { wrapper } from './ApplicationWrapper'

import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { Settings } from '~src/models/redux/Settings'
import { WCApprovalDate } from '~src/models/redux/WCApprovalDate'
import { Wallet } from '~src/models/redux/Wallet'

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
    return wrapper.storage['@settings'].bind().as(Settings)
  }

  /**
   * Wallets' user data
   */
  static get wallets() {
    return wrapper.storage['@wallets'].bind().asArrayOf(Wallet)
  }

  /**
   * Accounts' user data
   */
  static get accounts() {
    return wrapper.storage['@accounts'].bind().asArrayOf(Account)
  }

  /**
   * User contacts
   */
  static get contacts() {
    return wrapper.storage['@contacts'].bind().asArrayOf(Contact)
  }

  static get wcApprovalDates() {
    return wrapper.storage['@wcApprovalDate'].bind().asArrayOf(WCApprovalDate)
  }
}
