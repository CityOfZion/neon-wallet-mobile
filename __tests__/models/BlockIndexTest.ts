import {BlockIndex} from '~src/models/BlockIndex'

describe('BlockIndex', () => {
  it('can get height', async () => {
    const model = new BlockIndex()
    await model.getHeight()

    expect(model.height).not.toBeNull()
  })
})
