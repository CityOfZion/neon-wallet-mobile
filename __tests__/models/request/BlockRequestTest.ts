import {Block} from '~src/models/Block'
import {BlockRequest} from '~src/models/request/BlockRequest'

describe('BlockRequest', () => {
  const TEST_BLOCK_HASH =
    '9b1c3ba08a1f34732abc06e0c42ef4c301f33245f1974aaa60e538c3e0395f60'
  const request = new BlockRequest(TEST_BLOCK_HASH)

  it('can get block', async () => {
    const result = await request.getBlock()

    expect(result).toBeInstanceOf(Block)
  })
})
