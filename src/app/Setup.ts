import {RequestConfig} from '@simpli/serialized-request'

import {Config} from '~src/app/Config'

export class Setup {
  static init() {
    RequestConfig.axios = Config.http.axiosInstance
  }
}
