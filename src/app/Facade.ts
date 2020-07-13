import {Await, EventBus} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import _ from 'lodash'
import moment from 'moment'

import {ApplicationWrapper} from '~src/app/ApplicationWrapper'
import {Config} from '~src/app/Config'
import {Normalize} from '~src/app/Normalize'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {UtilsHelper} from '~src/helpers/UtilsHelper'

export abstract class Facade {
  static readonly wrapper = new ApplicationWrapper()
  static readonly bus = new EventBus()

  static readonly config = Config
  static readonly await = Await

  // Helpers
  static readonly filter = FilterHelper
  static readonly utils = UtilsHelper

  // Alias
  static get t() {
    return i18n.t
  }

  static get lodash() {
    return _
  }

  static get moment() {
    return moment
  }

  static get storage() {
    return this.wrapper.storage
  }

  static get theme() {
    return this.wrapper.theme
  }

  static get route() {
    return this.wrapper.route
  }

  static get app() {
    return this.config.application
  }

  static get axios() {
    return this.config.http.axiosInstance
  }

  static get scale() {
    return Normalize.scale
  }
}
