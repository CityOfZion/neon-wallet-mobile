import {RequestConfig, RequestListener} from '@simpli/serialized-request'
import i18n from 'i18n-js'

import {Facade} from '~src/app/Facade'
import {Lang} from '~src/enums/Lang'
import {StorageListener} from '@simpli/react-native-storage'

export abstract class Setup {
  static async init() {
    RequestConfig.axios = Facade.config.http.axiosInstance

    RequestListener.onRequestStart((name) => Facade.await.init(name))
    RequestListener.onRequestEnd((name) => Facade.await.done(name))
    RequestListener.onRequestError((name) => Facade.await.error(name))

    StorageListener.onStorageStart((name) => Facade.await.init(name))
    StorageListener.onStorageEnd((name) => Facade.await.done(name))

    i18n.defaultLocale = Facade.config.locale.defaultLanguage
    i18n.locale = Facade.config.locale.defaultLanguage
    i18n.fallbacks = Facade.config.locale.fallbacks
    i18n.translations = Facade.config.locale.translations
  }

  static changeLocale(lang: Lang) {
    i18n.locale = lang
  }
}
