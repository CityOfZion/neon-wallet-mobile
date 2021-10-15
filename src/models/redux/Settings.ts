import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {localeConfig} from '~/src/config/LocaleConfig'
import {Theme} from '~src/enums/Theme'

@HttpExclude()
export class Settings implements SettingsState {
  @HttpExpose()
  language = localeConfig.defaultLanguage

  @HttpExpose()
  currency = localeConfig.defaultCurrency

  @HttpExpose()
  theme = Theme.DARK

  @HttpExpose()
  security = localeConfig.defaultSecurity
}
