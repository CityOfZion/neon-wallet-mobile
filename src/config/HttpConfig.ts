/**
 * @file
 * Http Request Configuration
 * Used in library: axios
 *
 * This file provides the standard configuration to communicate with the server
 * See https://github.com/axios/axios
 */

import axios, {AxiosError} from 'axios'
// @ts-ignore
import qs from 'qs'

/**
 * HTTP Configuration
 */
export class HttpConfig {
  /**
   * Web Server request & response config
   */
  readonly axiosInstance = axios.create({
    paramsSerializer: (params) => qs.stringify(params, {arrayFormat: 'repeat'}), // myendpoint?myarray=1&myarray=2
  })

  constructor() {
    /**
     * Interceptor for every HTTP response of this app
     */
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const response = error.response

        if (!response) {
          console.log('Could not connect to server')
          return Promise.reject(error)
        }

        if (response.status >= 400) {
          // TODO: apply friendly error display
          // console.error(
          //   response.data.message ?? response.statusText,
          //   response.status.toString()
          // )
          return Promise.reject(error)
        }

        return Promise.reject(error)
      }
    )
  }
}

export const httpConfig = new HttpConfig()
