import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { deResources } from '@/locales/de'
import { enResources } from '@/locales/en'
import { ptBrResources } from '@/locales/pt-br'
import { zhResources } from '@/locales/zh'
import { zhHantResources } from '@/locales/zh-Hant'

export class I18nextHelper {
  static setup() {
    if (!i18n.isInitialized) {
      i18n.use(initReactI18next).init({
        resources: {
          en: enResources,
          de: deResources,
          'pt-BR': ptBrResources,
          zh: zhResources,
          'zh-Hant': zhHantResources,
        },
        ns: ['common'],
        defaultNS: 'common',
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
          escapeValue: false,
        },
      })
    }
  }

  static get = () => {
    this.setup()
    return i18n
  }
}
