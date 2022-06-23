import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { TransactionTransferType } from './TransactionAddressSummary'

@HttpExclude()
export class TransactionAddressNFT {
  @HttpExpose()
  to!: string

  @HttpExpose()
  from!: string

  @HttpExpose()
  hash!: string

  @HttpExpose()
  type!: TransactionTransferType.NFT

  @HttpExpose()
  tokenId!: string

  constructor(data: Omit<TransactionAddressNFT, 'type'>) {
    Object.assign(this, { ...data, type: TransactionTransferType.NFT })
  }
}
