import { TransactionTransferType } from './TransactionAddressSummary'

export class TransactionAddressAsset {
  to!: string

  from!: string

  amount!: number

  hash!: string

  type: TransactionTransferType.ASSET = TransactionTransferType.ASSET

  symbol!: string

  decimals!: number

  constructor(data: Omit<TransactionAddressAsset, 'type'>) {
    Object.assign(this, { ...data })
  }
}
