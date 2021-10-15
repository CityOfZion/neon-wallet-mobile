import {wrapper} from './ApplicationWrapper'

import {Node} from '~/src/models/Node'
import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {Settings} from '~src/models/redux/Settings'
import {Wallet} from '~src/models/redux/Wallet'
import {Exchange, MultichainExchange} from '~src/types/exchange'

export abstract class Storage {
  /**
   * Controls the span of onboarding screen
   */
  static get onboardingSeen() {
    return wrapper.storage['@onboarding_seen'].bind().asBoolean()
  }

  /**
   * Controls the span of welcome to neonwallet screen
   */
  static get welcomeToNWSeen() {
    return wrapper.storage['@welcome_to_nw_seen'].bind().asBoolean()
  }

  /**
   * Controls the span of welcome screen
   */
  static get welcomeHidden() {
    return wrapper.storage['@welcome_hidden'].bind().asBoolean()
  }

  /**
   * Controls the span of changelog screen
   */
  static get changelogHidden() {
    return wrapper.storage['@changelog_hidden'].bind().asBoolean()
  }

  /**
   * Controls the number of versions
   */
  static get numberOfVersions() {
    return wrapper.storage['@number_of_versions'].bind().asNumber()
  }

  /**
   * Controls if authentication was set up
   */
  static get hasAuthentication() {
    return wrapper.storage['@has_authentication'].bind().asBoolean()
  }

  /**
   * Controls if authentication for hardware was set up
   */
  static get hasAuthenticationForHardware() {
    return wrapper.storage['@has_authentication_hard'].bind().asBoolean()
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
  static get exchange() {
    return wrapper.storage['@exchange'].bind().as<Exchange>()
  }
  static get tokenAssets() {
    return wrapper.storage['@token_assets'].bind().asArrayOf(TokenAsset)
  }
  static get neoNodes() {
    return wrapper.storage['@neo_nodes'].bind().asArrayOf(NeoNode)
  }
  static get nodes() {
    return wrapper.storage['@nodes'].bind().asArrayOf(Node)
  }
  static get multichainExchange() {
    return wrapper.storage['@MultichainExchange']
      .bind()
      .as<MultichainExchange>()
  }
}
