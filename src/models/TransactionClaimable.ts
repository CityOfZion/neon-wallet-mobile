import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

@HttpExclude()
export class TransactionClaimable {
  @HttpExpose()
  txid: string | null = null

  @HttpExpose()
  value: number | null = null

  @HttpExpose()
  n: number | null = null

  @HttpExpose()
  generated: number | null = null

  @HttpExpose()
  unclaimed: number | null = null

  @HttpExpose('sys_fee')
  sysFee: number | null = null

  @HttpExpose('start_height')
  startHeight: number | null = null

  @HttpExpose('end_height')
  endHeight: string | null = null
}
