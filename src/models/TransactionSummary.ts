import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class TransactionSummary {
  @HttpExpose()
  txid: string | null = null

  @HttpExpose()
  value: number | null = null

  @HttpExpose()
  n: number | null = null

  @HttpExpose()
  asset: string | null = null

  @HttpExpose('address_hash')
  addressHash: string | null = null
}
