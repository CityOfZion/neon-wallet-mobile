import {Request} from '@simpli/serialized-request'
import {mapValues} from 'lodash'

import {NeoLegacyProvider} from './common'

import {NeoNode} from '~/src/models/NeoNode'
import {Node} from '~/src/models/Node'
import {TokenAsset} from '~/src/models/TokenAsset'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {ContractResponse} from '~/src/models/response/ContractResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'
import {ExchangeResponse} from '~/src/types/exchange'
import {TokenResponse} from '~/src/types/token'

export type NeoscanNetworkOptions = 'main_net' | 'test_net'

export class NeoscanProvider implements NeoLegacyProvider {
  readonly baseUrl: string
  //eslint-disable-next-line
  private network: NeoscanNetworkOptions = __DEV__ ? `main_net` : `main_net`
  readonly siteUrlQuery = `https://api.neoscan.io/api/${this.network}/v1/`
  constructor() {
    this.baseUrl = 'https://api.neoscan.io/api'
  }

  async getAddressAbstracts(
    address: string,
    tokens: TokenAsset[],
    page: number = 1
  ) {
    return Request.get(
      `${this.baseUrl}/${this.network}/v1/get_address_abstracts/${address}/${page}`
    )
      .name('getAddressAbstracts')
      .as(TransactionAddressResponse)
      .getData()
  }
  async getBalance(address: string) {
    return Request.get(
      `${this.baseUrl}/${this.network}/v1/get_balance/${address}`
    )
      .name('getBalance')
      .as(BalanceResponse)
      .getData()
  }
  async getTransaction(txid: string) {
    return Request.get(
      `${this.baseUrl}/${this.network}/v1/get_transaction/${txid}`
    )
      .name('getTransaction')
      .as(Transaction)
      .getData()
  }
  async getUnclaimed(address: string) {
    return Request.get(
      `${this.baseUrl}/${this.network}/v1/get_unclaimed/${address}`
    )
      .name('getUnclaimed')
      .as(UnclaimedResponse)
      .getData()
  }
  async getContract(hash: string): Promise<ContractResponse> {
    throw new Error('Method not implemented')
  }
  async getAllNodes() {
    const result: Node[] = []
    const response = await Request.get(
      `${this.baseUrl}/${this.network}/v1/get_all_nodes`
    )
      .name('getAllNodes')
      .asArrayOf(NeoNode)
      .getData()

    response.forEach(({height, url}) => {
      result.push({url, height, blockchain: 'neoLegacy'})
    })

    return result
  }

  async getTokenList() {
    return Request.get(
      `https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json?timestamp=${new Date().getTime()}`
    )
      .name('getTokens')
      .as<TokenResponse>()
      .getData()
  }

  async getExchangeData(params: {
    tokenAssetSymbols: string[]
    currencies: string
  }) {
    const {tokenAssetSymbols, currencies} = params
    const paramRequest = {
      fsyms: tokenAssetSymbols.join(','),
      tsyms: currencies,
    }

    const response = await Request.get(
      'https://min-api.cryptocompare.com/data/pricemultifull',
      {params: paramRequest}
    )
      .name('syncExchange')
      .as<ExchangeResponse>()
      .getData()

    return mapValues(response.RAW, (symbolRef) => {
      const symbolRefMap = mapValues(
        symbolRef,
        (symbolToUse) => symbolToUse.PRICE
      )

      return {
        to: symbolRefMap,
      }
    })
  }

  async getAssetByHash(hash: string) {
    throw new Error('not implement endpoint')
    return null
  }
}
