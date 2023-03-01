import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { localeConfig } from '~/src/config/LocaleConfig'
import { SettingsState } from '~/src/types/reducers/settings'
import { Theme } from '~src/enums/Theme'

@HttpExclude()
export class Settings implements Omit<SettingsState, 'networks'> {
  @HttpExpose()
  language = localeConfig.defaultLanguage

  @HttpExpose()
  currency = localeConfig.defaultCurrency

  @HttpExpose()
  theme = Theme.DARK

  @HttpExpose()
  security = localeConfig.defaultSecurity

  @HttpExpose()
  isFirstTime = false
}
