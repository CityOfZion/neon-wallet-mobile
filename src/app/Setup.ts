import {RequestConfig} from '@simpli/serialized-request'
import i18n from 'i18n-js'

import {Facade} from '~src/app/Facade'

export abstract class Setup {
  static init() {
    RequestConfig.axios = Facade.config.http.axiosInstance

    i18n.defaultLocale = Facade.config.i18n.defaultLocale
    i18n.locale = Facade.config.i18n.locale
    i18n.fallbacks = Facade.config.i18n.fallbacks
    i18n.translations = Facade.config.i18n.translations
  }
}
