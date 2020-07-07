import i18n from 'i18n-js'
import _ from 'lodash'
import moment from 'moment'

import {Config} from '~src/app/Config'
import {Normalize} from '~src/app/Normalize'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {UtilsHelper} from '~src/helpers/UtilsHelper'

export abstract class Facade {
  // App
  static readonly config = Config

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

  static get space() {
    return Normalize.space
  }

  static get app() {
    return this.config.application
  }

  static get path() {
    return this.config.route.path
  }

  static get themeDark() {
    return this.config.themeDark
  }

  static get themeLight() {
    return this.config.themeLight
  }

  static get axios() {
    return this.config.http.axiosInstance
  }
}
