import {Security} from '../enums/Security'

import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'

/**
 * Locale Configuration
 */
export class LocaleConfig {
  readonly defaultCurrency = Currency.USD
  readonly defaultLanguage = Lang.EN_US
  readonly defaultSecurity = Security.disabled
  readonly fallbacks = true

  readonly translations: Record<string, any> = {
    [Lang.EN_US]: require('~src/locales/en-US/lang.json'),
    [Lang.DE]: require('~src/locales/de/lang.json'),
    [Lang.PT_BR]: require('~src/locales/pt-BR/lang.json'),
  }
}
