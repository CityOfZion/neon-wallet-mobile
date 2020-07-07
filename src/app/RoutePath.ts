import i18n from 'i18n-js'
import {snakeCase} from 'lodash'

import {RouteConfig} from '~src/config/RouteConfig'

export type PathName = RouteConfig['pathNames'][number]

export type RoutePathMap = {
  [T in PathName]: RoutePath<T>
}

export class RoutePath<T extends string> {
  id: string
  name: T

  constructor(uniqueName: T) {
    this.name = uniqueName
    this.id = snakeCase(uniqueName)
  }

  translate() {
    return i18n.t(`routes.${this.name}`)
  }
}
