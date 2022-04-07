import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {TransactionAddressTransfer} from './TransactionAddressTransfer'

@HttpExclude()
export class TransactionAddressSummary {
  @HttpExpose()
  hash: string

  @HttpExpose()
  time: number

  @HttpExpose('block_height')
  blockHeight: number

  @HttpExpose()
  @ResponseSerialize(TransactionAddressTransfer)
  transfers: TransactionAddressTransfer[] = []

  @HttpExpose()
  qtyInvocations: number = 0

  @HttpExpose()
  qtyNotifications: number = 0

  constructor(
    data: Omit<
      TransactionAddressSummary,
      'qtyInvocations' | 'qtyNotifications' | 'transfers'
    >
  ) {
    this.hash = data.hash
    this.time = data.time
    this.blockHeight = data.blockHeight
  }
}
