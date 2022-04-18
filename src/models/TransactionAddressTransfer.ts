import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class TransactionAddressTransfer {
  @HttpExpose()
  to: string

  @HttpExpose()
  from: string

  @HttpExpose()
  amount: number

  @HttpExpose()
  hash: string

  constructor(data: TransactionAddressTransfer) {
    this.to = data.to
    this.from = data.from
    this.amount = data.amount
    this.hash = data.hash
  }
}
