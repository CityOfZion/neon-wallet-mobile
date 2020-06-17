import i18n from 'i18n-js'

import de from '~src/locales/de.json'
import en from '~src/locales/en.json'
import ptBR from '~src/locales/pt-br.json'

i18n.defaultLocale = 'en'
i18n.locale = 'en'
i18n.fallbacks = true
i18n.translations = {en, de, ptBR}

export default i18n
