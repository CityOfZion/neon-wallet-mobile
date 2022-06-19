import React from 'react'
import renderer from 'react-test-renderer'

import QrCodeGenerateTest from '~src/scenes/TestPage/QrCodeGenerateTest'

describe('<QrCodeGenerateTest />', () => {
  it('has 2 child', () => {
    const tree = renderer.create(<QrCodeGenerateTest />).toJSON()

    expect(tree?.children?.length).toBe(2)
  })
})
