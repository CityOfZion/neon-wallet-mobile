import {NeoNode} from '~src/models/NeoNode'

describe('NeoNode', () => {
  it('can get all nodes', async () => {
    const result = await NeoNode.getAllNodes()

    expect(result).toBeInstanceOf(Array)
  })
})
