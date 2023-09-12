import queryString from 'query-string'

import { UtilsHelper } from './UtilsHelper'

export class GenericWalletURLHelper {
  static validateAndParse(url: string): string | undefined {
    const urlIsValid = UtilsHelper.validateURL(url)
    if (!urlIsValid) return

    const { query } = queryString.parseUrl(url)
    if (!('key' in query) || !query.key || Array.isArray(query.key)) return

    return query.key
  }
}
