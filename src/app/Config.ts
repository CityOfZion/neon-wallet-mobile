import {HttpConfig} from '~src/config/HttpConfig'
import {I18nConfig} from '~src/config/I18nConfig'
import {RouteConfig} from '~src/config/RouteConfig'

export abstract class Config {
  static readonly http = new HttpConfig()
  static readonly i18n = new I18nConfig()
  static readonly route = new RouteConfig()
}
