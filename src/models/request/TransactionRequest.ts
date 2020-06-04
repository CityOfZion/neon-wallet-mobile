import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {Transaction} from '~src/models/Transaction'

@HttpExclude()
export class TransactionRequest {
  constructor(transactionHash: string) {
    this.transactionHash = transactionHash
  }

  @RequestExpose('transaction_hash')
  transactionHash: string

  async getTransaction() {
    const {transactionHash} = this

    return Request.get(`/get_transaction/${transactionHash}`)
      .name('getTransaction')
      .as(Transaction)
      .getData()
  }
}
