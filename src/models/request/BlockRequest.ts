import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {Block} from '~src/models/Block'

@HttpExclude()
export class BlockRequest {
  constructor(blockHash: string) {
    this.blockHash = blockHash
  }

  @RequestExpose('block_hash')
  blockHash: string

  async getBlock() {
    const {blockHash} = this

    return Request.get(`/get_block/${blockHash}`)
      .name('getBlock')
      .as(Block)
      .getData()
  }
}
