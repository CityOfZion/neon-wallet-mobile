import { Await } from '@simpli/react-native-await'
import { StorageListener } from '@simpli/react-native-storage'
import i18n from 'i18n-js'

import { localeConfig } from '~src/config/LocaleConfig'
import { Lang } from '~src/enums/Lang'

export abstract class Setup {
  static async init() {
    StorageListener.onStorageStart(name => Await.init(name))
    StorageListener.onStorageEnd(name => Await.done(name))

    i18n.defaultLocale = localeConfig.defaultLanguage
    i18n.locale = localeConfig.defaultLanguage
    i18n.fallbacks = localeConfig.fallbacks
    i18n.translations = localeConfig.translations
  }

  static changeLocale(lang: Lang) {
    i18n.locale = lang
  }
}
