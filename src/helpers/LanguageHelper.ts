import * as ExpoLocalization from 'expo-localization'

import type { TLanguage } from '@/types/store'

export class LanguageHelper {
  static readonly availableLanguages: TLanguage[] = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Português (BR)', value: 'pt-BR' },
    { label: '简体中文', value: 'zh' },
    { label: '繁體中文', value: 'zh-Hant' },
  ]

  static readonly defaultLanguage: TLanguage = this.availableLanguages[0]

  static detectDeviceLanguage(): TLanguage {
    const locales = ExpoLocalization.getLocales()
    const availableLanguageValues = this.availableLanguages.map(language => language.value)

    for (const { languageTag, languageCode } of locales) {
      // Exact tag match ("pt-BR", "zh-Hant")
      if (availableLanguageValues.includes(languageTag)) {
        return this.availableLanguages.find(language => language.value === languageTag)!
      }

      // Chinese variants: zh-TW, zh-HK, zh-MO → zh-Hant; zh-CN, zh-SG → zh
      if (languageCode === 'zh') {
        const isTraditionalChinese = /^zh-(TW|HK|MO)/.test(languageTag)
        const fixedLanguageTag = isTraditionalChinese ? 'zh-Hant' : 'zh'
        return this.availableLanguages.find(language => language.value === fixedLanguageTag)!
      }

      // Language prefix match ("de-AT" → "de", "en-US" → "en")
      const languageByPrefix = this.availableLanguages.find(language => language.value === languageCode)
      if (languageByPrefix) {
        return languageByPrefix
      }
    }

    return this.defaultLanguage
  }
}
