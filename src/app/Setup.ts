import {RequestConfig} from '@simpli/serialized-request'
import i18n from 'i18n-js'

import {$} from '~/facade'

export abstract class Setup {
  static init() {
    RequestConfig.axios = $.config.http.axiosInstance

    i18n.defaultLocale = $.config.i18n.defaultLocale
    i18n.locale = $.config.i18n.locale
    i18n.fallbacks = $.config.i18n.fallbacks
    i18n.translations = $.config.i18n.translations
  }
}
