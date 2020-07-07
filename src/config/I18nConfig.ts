import i18n from 'i18n-js'

import {Lang} from '~src/enums/Lang'

/**
 * Locale Configuration
 */
export class I18nConfig {
  readonly defaultLocale = Lang.EN_US

  readonly locale = Lang.EN_US

  readonly fallbacks = true

  readonly translations: Record<string, any> = {
    [Lang.EN_US]: require('~src/locales/en-US/lang.json'),
    [Lang.DE]: require('~src/locales/de/lang.json'),
    [Lang.PT_BR]: require('~src/locales/pt-BR/lang.json'),
  }
}
