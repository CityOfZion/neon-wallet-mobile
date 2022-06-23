import { HttpExpose } from '@simpli/serialized-request'

import { BlockchainServiceKey } from '~src/blockchain'
export class Node {
  @HttpExpose()
  url: string | null = null

  @HttpExpose()
  height: number | null = null

  @HttpExpose()
  blockchain: BlockchainServiceKey = 'neoLegacy'
}
