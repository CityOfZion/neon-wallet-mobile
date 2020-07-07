import {ApplicationConfig} from '~src/config/ApplicationConfig'
import {HttpConfig} from '~src/config/HttpConfig'
import {I18nConfig} from '~src/config/I18nConfig'
import {RouteConfig} from '~src/config/RouteConfig'
import {ScreenConfig} from '~src/config/ScreenConfig'
import {StyleConfig} from '~src/config/StyleConfig'
import {ThemeConfig} from '~src/config/ThemeConfig'
import {ThemeDarkConfig} from '~src/config/ThemeDarkConfig'
import {ThemeLightConfig} from '~src/config/ThemeLightConfig'

export abstract class Config {
  static readonly application = new ApplicationConfig()
  static readonly http = new HttpConfig()
  static readonly i18n = new I18nConfig()
  static readonly route = new RouteConfig()
  static readonly screen = new ScreenConfig()
  static readonly style = new StyleConfig()
  static readonly theme = new ThemeConfig()
  static readonly themeDark = new ThemeDarkConfig()
  static readonly themeLight = new ThemeLightConfig()
}
