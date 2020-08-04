/**
 * @file
 * Http Request Configuration
 * Used in library: axios
 *
 * This file provides the standard configuration to communicate with the server
 * See https://github.com/axios/axios
 */

import axios, {AxiosError} from 'axios'
import qs from 'qs'

/**
 * HTTP Configuration
 */
export class HttpConfig {
  /**
   * Web Server request & response config
   */
  readonly axiosInstance = axios.create({
    // TODO: use environment variable for baseURL
    baseURL: 'https://neoscan-testnet.io/api/test_net/v1',
    // baseURL: 'https://api.neoscan.io/api/main_net/v1',
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
          return console.log('Could not connect to server')
        }

        if (response.status >= 400) {
          // TODO: apply friendly error display
          console.error(
            response.data.message ?? response.statusText,
            response.status.toString()
          )
          return Promise.reject(error)
        }

        return Promise.reject(error)
      }
    )
  }
}
