import 'reflect-metadata'
import {RequestConfig} from '@simpli/serialized-request'

import {HttpConfig} from '~src/config/HttpConfig'

const httpConfig = new HttpConfig()
RequestConfig.axios = httpConfig.axiosInstance
