import base64 from 'react-native-base64'

import { validateAddressAllBlockchains } from '~src/blockchain'
import { TokenAsset } from '~src/models/TokenAsset'
export type TScheme = 'wc:' | 'neo:'

export const SCHEME: TScheme[] = ['neo:', 'wc:']

// URI interface
export interface IURI {
  address: string
  tokenHash?: string
  amount?: number
  reference?: string
}

export abstract class UriHelper {
  static generate(address: string, amount?: number, token?: TokenAsset, reference?: string) {
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

  static isValidAsString(str: string) {
    const key = SCHEME.find(it => str.startsWith(it))

    if (UriHelper.isValid(str)) {
      return key
    }
  }

  static isValid(str: string) {
    const key = SCHEME.find(it => str.startsWith(it))
    const isNeo = key === 'neo:'

    if (isNeo) {
      return key && validateAddressAllBlockchains(str.substr(key.length).split('?')[0])
    }

    return !!key
  }

  static parse(str: string): IURI | undefined {
    const key = SCHEME.find(it => str.startsWith(it)) ?? ''
    const isNeo = key === 'neo:'

    if (!this.isValid(str) || !isNeo) return undefined

    const substrings = str.substr(key.length).split('?')
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

    return { address, tokenHash, amount, reference }
  }

  static checkIsBase64(uri: string) {
    const regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return regexBase64.test(uri)
  }

  static convertBase64ToUri(uri: string) {
    if (UriHelper.checkIsBase64(uri)) {
      return base64.decode(uri)
    }
    return uri
  }

  private static _getParam<T extends string | number>(params: string[], param: string): T | undefined {
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
