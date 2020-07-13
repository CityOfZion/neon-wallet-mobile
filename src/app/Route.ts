import i18n from 'i18n-js'
import {snakeCase} from 'lodash'

export class Route<T extends string> {
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
