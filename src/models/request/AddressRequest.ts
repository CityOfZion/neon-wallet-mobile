import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {BalanceResponse} from '~src/models/response/BalanceResponse'
import {ClaimableResponse} from '~src/models/response/ClaimableResponse'
import {ClaimedResponse} from '~src/models/response/ClaimedResponse'
import {UnclaimedResponse} from '~src/models/response/UnclaimedResponse'

@HttpExclude()
export class AddressRequest {
  constructor(address: string) {
    this.address = address
  }

  @RequestExpose()
  address: string

  async getBalance() {
    const {address} = this

    return Request.get(`/get_balance/${address}`)
      .name('getBalance')
      .as(BalanceResponse)
      .getData()
  }

  async getClaimable() {
    const {address} = this

    return Request.get(`/get_claimable/${address}`)
      .name('getClaimable')
      .as(ClaimableResponse)
      .getData()
  }

  async getClaimed() {
    const {address} = this

    return Request.get(`/get_claimed/${address}`)
      .name('getClaimed')
      .as(ClaimedResponse)
      .getData()
  }

  async getUnclaimed() {
    const {address} = this

    return Request.get(`/get_unclaimed/${address}`)
      .name('getUnclaimed')
      .as(UnclaimedResponse)
      .getData()
  }
}
