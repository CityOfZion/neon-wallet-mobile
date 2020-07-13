import {ApplicationConfig} from '~src/config/ApplicationConfig'
import {HttpConfig} from '~src/config/HttpConfig'
import {LocaleConfig} from '~src/config/LocaleConfig'
import {ScreenConfig} from '~src/config/ScreenConfig'
import {StyleConfig} from '~src/config/StyleConfig'
import {WrapperConfig} from '~src/config/WrapperConfig'

export abstract class Config {
  static readonly application = new ApplicationConfig()
  static readonly http = new HttpConfig()
  static readonly locale = new LocaleConfig()
  static readonly screen = new ScreenConfig()
  static readonly style = new StyleConfig()
  static readonly wrapper = new WrapperConfig()
}
