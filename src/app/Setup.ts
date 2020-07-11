import {RequestConfig} from '@simpli/serialized-request'
import i18n from 'i18n-js'

import {Facade} from '~src/app/Facade'
import {Lang} from '~src/enums/Lang'

export abstract class Setup {
  static async init() {
    RequestConfig.axios = Facade.config.http.axiosInstance

    i18n.defaultLocale = Facade.config.locale.defaultLanguage
    i18n.locale = Facade.config.locale.defaultLanguage
    i18n.fallbacks = Facade.config.locale.fallbacks
    i18n.translations = Facade.config.locale.translations
  }

  static changeLocale(lang: Lang) {
    i18n.locale = lang
  }
}
