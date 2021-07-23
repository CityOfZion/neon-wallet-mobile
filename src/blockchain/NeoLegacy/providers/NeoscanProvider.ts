import {Request} from '@simpli/serialized-request'

import {NeoLegacyProvider} from './common'

import {NeoNode} from '~/src/models/NeoNode'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'

export type NeoscanNetworkOptions = 'main_net' | 'test_net'

export class NeoscanProvider implements NeoLegacyProvider {
  readonly baseUrl: string
  private network: NeoscanNetworkOptions
  constructor() {
    this.baseUrl = 'https://api.neoscan.io/api'
    this.network = 'main_net' //by default is mainnet selected
  }

  async getAddressAbstracts(address: string, page: number = 1) {
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
  async getAllNodes() {
    return Request.get(`${this.baseUrl}/${this.network}/v1/get_all_nodes`)
      .name('getAllNodes')
      .asArrayOf(NeoNode)
      .getData()
  }
}
