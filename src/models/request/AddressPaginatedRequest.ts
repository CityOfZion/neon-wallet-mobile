import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {Transaction} from '~src/models/Transaction'
import {TransactionAddressResponse} from '~src/models/response/TransactionAddressResponse'

@HttpExclude()
export class AddressPaginatedRequest {
  constructor(address: string, page = 1) {
    this.address = address
    this.page = page
  }

  @RequestExpose()
  address: string

  @RequestExpose()
  page: number

  async getAddressAbstracts() {
    const {address, page} = this

    return Request.get(`/get_address_abstracts/${address}/${page}`)
      .name('getAddressAbstracts')
      .as(TransactionAddressResponse)
      .getData()
  }

  async getLastTransactions() {
    const {address, page} = this

    return Request.get(`/get_last_transactions_by_address/${address}/${page}`)
      .name('getLastTransactions')
      .asArrayOf(Transaction)
      .getData()
  }
}
