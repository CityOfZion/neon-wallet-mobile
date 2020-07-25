import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {TransactionSummary} from '~src/models/TransactionSummary'

@HttpExclude()
export class Balance {
  @HttpExpose()
  @ResponseSerialize(TransactionSummary)
  unspent: TransactionSummary[] = []

  @HttpExpose()
  amount: number | null = null

  @HttpExpose('asset_symbol')
  assetSymbol: string | null = null

  @HttpExpose('asset_hash')
  assetHash: number | null = null

  @HttpExpose()
  asset: number | null = null
}
