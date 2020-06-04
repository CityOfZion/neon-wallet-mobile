import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {TransactionAddressResponse} from '~src/models/response/TransactionAddressResponse'

@HttpExclude()
export class AddressPairPaginatedRequest {
  constructor(address1: string, address2: string, page = 1) {
    this.address1 = address1
    this.address2 = address2
    this.page = page
  }

  @RequestExpose()
  address1: string

  @RequestExpose()
  address2: string

  @RequestExpose()
  page: number

  async getAddressToAddressAbstracts() {
    const {address1, address2, page} = this

    return Request.get(`/get_address_abstracts/${address1}/${address2}/${page}`)
      .name('getAddressToAddressAbstracts')
      .as(TransactionAddressResponse)
      .getData()
  }
}
