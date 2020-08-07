import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {Facade} from '~src/app/Facade'

@HttpExclude()
export class Settings implements SettingsState {
  @HttpExpose()
  language = Facade.config.locale.defaultLanguage

  @HttpExpose()
  currency = Facade.config.locale.defaultCurrency

  @HttpExpose()
  theme = Facade.config.application.defaultTheme

  @HttpExpose()
  network = Facade.config.application.mainNetwork
}
