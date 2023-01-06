import { validateAddressAllBlockchains } from '~src/blockchain'

export interface IURI {
  address: string
  tokenHash?: string
  amount?: number
  reference?: string
}

export abstract class UriHelper {
  static generate(address: string, amount?: number | string, tokenHash?: string, reference?: string) {
    const params = []
    tokenHash && params.push(`asset=${tokenHash}`)
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
    const listOfPrefix = ['wc', 'neo']
    return listOfPrefix.some(prefix => str.startsWith(prefix))
  }

  static validateAndParse(str: string): IURI | undefined {
    if (!this.isValid(str)) return

    const [address, params] = str.substring(3).split('?')

    if (!validateAddressAllBlockchains(address)) return

    let tokenHash: string | undefined
    let amount: number | undefined
    let reference: string | undefined

    if (params) {
      const splitedParams = params.split('&')

      tokenHash = this.getParam(splitedParams, 'asset')

      amount = this.getParam(splitedParams, 'amount')
      reference = this.getParam(splitedParams, 'remark')
    }

    return { address, tokenHash, amount, reference }
  }

  private static getParam<T extends string | number>(params: string[], param: string): T | undefined {
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
