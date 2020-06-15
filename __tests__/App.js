import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import App from '../src/App'

// Note: test renderer must be required after react-native.

// TODO: verify the reason this test is falling, fix it and remove '.skip'
it.skip('renders correctly', () => {
  renderer.create(<App />)
})
