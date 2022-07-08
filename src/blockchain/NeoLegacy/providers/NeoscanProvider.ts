import { Request } from '@simpli/serialized-request'

import { NeoLegacyProvider } from './common'

import { NeoNode } from '~/src/models/NeoNode'
import { Node } from '~/src/models/Node'
import { Transaction } from '~/src/models/Transaction'
import { BalanceInfo } from '~/src/models/response/BalanceInfo'
import { ContractResponse } from '~/src/models/response/ContractResponse'
import { TransactionAddressResponse } from '~/src/models/response/TransactionAddressResponse'
import { UnclaimedResponse } from '~/src/models/response/UnclaimedResponse'

export type NeoscanNetworkOptions = 'main_net' | 'test_net'

export class NeoscanProvider implements NeoLegacyProvider {
  readonly baseUrl: string
  //eslint-disable-next-line
  private network: NeoscanNetworkOptions = __DEV__ ? `main_net` : `main_net`
  readonly siteUrlQuery = `https://api.neoscan.io/api/${this.network}/v1/`
  constructor() {
    this.baseUrl = 'https://api.neoscan.io/api'
  }

  async getAddressAbstracts(address: string, page: number = 1) {
    return Request.get(`${this.baseUrl}/${this.network}/v1/get_address_abstracts/${address}/${page}`)
      .name('getAddressAbstracts')
      .as(TransactionAddressResponse)
      .getData()
  }
  async getBalance(address: string): Promise<BalanceInfo[]> {
    const { balance: balances } = await Request.get(`${this.baseUrl}/${this.network}/v1/get_balance/${address}`)
      .asAny()
      .getData()

    return balances.map(
      (balance: any): BalanceInfo => ({
        amount: balance.amount,
        hash: balance.assetHash,
        name: balance.asset,
        symbol: balance.assetSymbol,
      })
    )
  }

  async getTransaction(txid: string) {
    return Request.get(`${this.baseUrl}/${this.network}/v1/get_transaction/${txid}`)
      .name('getTransaction')
      .as(Transaction)
      .getData()
  }
  async getUnclaimed(address: string) {
    return Request.get(`${this.baseUrl}/${this.network}/v1/get_unclaimed/${address}`)
      .name('getUnclaimed')
      .as(UnclaimedResponse)
      .getData()
  }
  async getContract(hash: string): Promise<ContractResponse> {
    throw new Error('Method not implemented')
  }
  async getAllNodes() {
    const result: Node[] = []
    const response = await Request.get(`${this.baseUrl}/${this.network}/v1/get_all_nodes`)
      .name('getAllNodes')
      .asArrayOf(NeoNode)
      .getData()

    response.forEach(({ height, url }) => {
      result.push({ url, height, blockchain: 'neoLegacy' })
    })

    return result
  }

  async getAssetByHash(hash: string): Promise<{ symbol: string; decimals: number } | null> {
    throw new Error('not implement endpoint')
  }
}
