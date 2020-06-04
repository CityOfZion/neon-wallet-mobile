import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {Script} from '~src/models/Script'

@HttpExclude()
export class Block {
  @HttpExpose()
  @ResponseSerialize(Script)
  script: Script | null = null

  @HttpExpose()
  index: number | null = null

  @HttpExpose()
  hash: string | null = null

  @HttpExpose()
  confirmations: number | null = null

  @HttpExpose()
  version: number | null = null

  @HttpExpose('tx_count')
  txCount: number | null = null

  @HttpExpose()
  transfers: string[] = []

  @HttpExpose()
  transactions: string[] = []

  @HttpExpose()
  time: number | null = null

  @HttpExpose()
  size: number | null = null

  @HttpExpose('previousblockhash')
  previousBlockHash: string | null = null

  @HttpExpose()
  nonce: string | null = null

  @HttpExpose('nextconsensus')
  nextConsensus: string | null = null

  @HttpExpose('nextblockhash')
  nextBlockHash: string | null = null

  @HttpExpose('merkleroot')
  merkleRoot: string | null = null
}
