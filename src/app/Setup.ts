import {Await} from '@simpli/react-native-await'
import {StorageListener} from '@simpli/react-native-storage'
import {RequestConfig, RequestListener} from '@simpli/serialized-request'
import i18n from 'i18n-js'
import {Platform} from 'react-native'

import {httpConfig} from '~src/config/HttpConfig'
import {localeConfig} from '~src/config/LocaleConfig'
import {Lang} from '~src/enums/Lang'

export abstract class Setup {
  static async init() {
    if (Platform.OS === 'android') {
      // https://github.com/facebook/react-native/issues/19410
      // only android needs polyfill
      require('intl') // import intl object
      require('intl/locale-data/jsonp/en-US')
      require('intl/locale-data/jsonp/pt-BR')
      require('intl/locale-data/jsonp/de')
    }

    RequestConfig.axios = httpConfig.axiosInstance

    RequestListener.onRequestStart((name) => Await.init(name))
    RequestListener.onRequestEnd((name) => Await.done(name))
    RequestListener.onRequestError((name) => Await.error(name))

    StorageListener.onStorageStart((name) => Await.init(name))
    StorageListener.onStorageEnd((name) => Await.done(name))

    i18n.defaultLocale = localeConfig.defaultLanguage
    i18n.locale = localeConfig.defaultLanguage
    i18n.fallbacks = localeConfig.fallbacks
    i18n.translations = localeConfig.translations
  }

  static changeLocale(lang: Lang) {
    i18n.locale = lang
  }
}
