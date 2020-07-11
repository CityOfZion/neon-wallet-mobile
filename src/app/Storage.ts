import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Theme} from '~src/enums/Theme'
import {Wallet} from '~src/models/Wallet'

export abstract class Storage {
  /**
   * User language preference
   */
  static get language() {
    return Facade.storage['@language'].bind().asString<Lang>()
  }

  /**
   * User currency preference
   */
  static get currency() {
    return Facade.storage['@currency'].bind().asString<Currency>()
  }

  /**
   * User theme preference
   */
  static get theme() {
    return Facade.storage['@theme'].bind().asString<Theme>()
  }

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
   * Wallets' user data
   */
  static get wallets() {
    return Facade.storage['@wallets'].bind().asArrayOf(Wallet)
  }
}
