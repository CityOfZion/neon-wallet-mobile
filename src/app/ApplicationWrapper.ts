import {StorageWrapper} from '../types/wrappers/data'
import {RouteWrapper} from '../types/wrappers/route'
import {ThemeWrapper} from '../types/wrappers/theme'

import {DataKey} from '~src/app/DataKey'
import {Route} from '~src/app/Route'
import {wrapperConfig} from '~src/config/WrapperConfig'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

export class ApplicationWrapper {
  readonly theme: ThemeWrapper
  readonly storage: StorageWrapper
  readonly route: RouteWrapper

  constructor() {
    const theme: Record<string, ApplicationTheme> = {}
    const storage: Record<string, DataKey<string>> = {}
    const route: Record<string, Route<string>> = {}

    wrapperConfig.themes.forEach(ApplicationTheme => {
      const applicationTheme: ApplicationTheme = new ApplicationTheme()
      theme[applicationTheme.id] = applicationTheme
    })

    wrapperConfig.dataKeys.forEach(it => {
      storage[it] = new DataKey(it)
    })

    wrapperConfig.routes.forEach(it => {
      route[it] = new Route(it)
    })

    this.theme = theme as ThemeWrapper
    this.storage = storage as StorageWrapper
    this.route = route as RouteWrapper
  }
}

export const wrapper = new ApplicationWrapper()
