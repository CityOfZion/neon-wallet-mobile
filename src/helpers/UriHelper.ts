import {validateAddressAllBlockchains} from '~src/blockchain'
import {TokenAsset} from '~src/models/TokenAsset'
export const SCHEME = 'neo:'

// URI interface
export interface NeoURI {
  address: string
  tokenHash?: string
  amount?: number
  reference?: string
}

export abstract class UriHelper {
  static generate(
    address: string,
    amount?: number,
    token?: TokenAsset,
    reference?: string
  ) {
    const params = []
    token && params.push(`asset=${token.hash}`)
    amount && params.push(`amount=${amount}`)
    reference && params.push(`remark=${amount}`)

    const base = `neo:${address}`

    if (params.length > 0) {
      return `${base}?${params.join('&')}`
    } else {
      return base
    }
  }

  static isValid(str: string) {
    return (
      str.startsWith(SCHEME) &&
      validateAddressAllBlockchains(str.substr(SCHEME.length).split('?')[0])
    )
  }

  static parse(str: string): NeoURI | undefined {
    if (!this.isValid(str)) return undefined

    const substrings = str.substr(SCHEME.length).split('?')
    const address = substrings[0]

    let tokenHash: string | undefined
    let amount: number | undefined
    let reference: string | undefined

    // If params
    if (substrings.length > 1) {
      const params = substrings[1].split('&')

      tokenHash = this._getParam(params, 'asset')

      amount = this._getParam(params, 'amount')
      reference = this._getParam(params, 'remark')
    }

    return {address, tokenHash, amount, reference}
  }

  private static _getParam<T extends string | number>(
    params: string[],
    param: string
  ): T | undefined {
    for (const kv of params) {
      const substrings = kv.split('=')
      const key = substrings[0]
      const value = substrings.length > 1 ? substrings[1] : undefined

      if (key === param) {
        return value as T
      }
    }
  }
}
