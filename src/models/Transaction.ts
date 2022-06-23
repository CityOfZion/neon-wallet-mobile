import { HttpExclude, HttpExpose, ResponseSerialize } from '@simpli/serialized-request'

import { Attribute } from '~src/models/Attribute'
import { Script } from '~src/models/Script'
import { TransactionSummary } from '~src/models/TransactionSummary'

@HttpExclude()
export class Transaction {
  @HttpExpose()
  @ResponseSerialize(TransactionSummary)
  vouts: TransactionSummary[] = []

  @HttpExpose()
  @ResponseSerialize(TransactionSummary)
  vin: TransactionSummary[] = []

  @HttpExpose()
  @ResponseSerialize(TransactionSummary)
  claims: TransactionSummary[] = []

  @HttpExpose()
  @ResponseSerialize(Script)
  scripts: Script[] = []

  @HttpExpose()
  @ResponseSerialize(Attribute)
  attributes: Attribute[] = []

  @HttpExpose()
  txid: string | null = null

  @HttpExpose()
  type: string | null = null

  @HttpExpose()
  version: number | null = null

  @HttpExpose()
  time: number | null = null

  @HttpExpose('sys_fee')
  sysFee: number | null = null

  @HttpExpose()
  size: number | null = null

  @HttpExpose('pubkey')
  pubKey: string | null = null

  @HttpExpose()
  nonce: string | null = null

  @HttpExpose('net_fee')
  netFee: string | null = null

  @HttpExpose()
  description: string | null = null

  @HttpExpose()
  contract: string | null = null

  @HttpExpose('block_height')
  blockHeight: number | null = null

  @HttpExpose('block_hash')
  blockHash: string | null = null

  @HttpExpose()
  asset: string | null = null
}
