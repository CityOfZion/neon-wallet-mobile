import {Config} from '~src/app/Config'
import {Route} from '~src/app/Route'
import {DataKey} from '~src/app/data/DataKey'
import {AwaitWrapper} from '~src/app/wrapper/AwaitWrapper'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

export class ApplicationWrapper {
  readonly await = new AwaitWrapper()

  readonly theme: ThemeWrapper
  readonly storage: StorageWrapper
  readonly route: RouteWrapper

  constructor() {
    const theme: Record<string, ApplicationTheme> = {}
    const storage: Record<string, DataKey<string>> = {}
    const route: Record<string, Route<string>> = {}

    Config.wrapper.themes.forEach((ApplicationTheme) => {
      const applicationTheme: ApplicationTheme = new ApplicationTheme()
      theme[applicationTheme.id] = applicationTheme
    })

    Config.wrapper.dataKeys.forEach((it) => {
      storage[it] = new DataKey(it)
    })

    Config.wrapper.routes.forEach((it) => {
      route[it] = new Route(it)
    })

    this.theme = theme as ThemeWrapper
    this.storage = storage as StorageWrapper
    this.route = route as RouteWrapper
  }
}
