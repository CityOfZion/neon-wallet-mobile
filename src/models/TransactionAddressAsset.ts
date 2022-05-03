import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {TransactionTransferType} from './TransactionAddressSummary'

@HttpExclude()
export class TransactionAddressAsset {
  @HttpExpose()
  to!: string

  @HttpExpose()
  from!: string

  @HttpExpose()
  amount!: number

  @HttpExpose()
  hash!: string

  @HttpExpose()
  type!: TransactionTransferType.ASSET

  constructor(data: Omit<TransactionAddressAsset, 'type'>) {
    Object.assign(this, {...data, type: TransactionTransferType.ASSET})
  }
}
