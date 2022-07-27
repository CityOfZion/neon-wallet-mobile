import './shim'
import { registerRootComponent } from 'expo'

import 'text-encoding-polyfill'
import 'reflect-metadata'

import App from './src/App'
import { Setup } from './src/app/Setup'

import 'react-native-get-random-values'

import { fetch as fetchPolyfill } from 'whatwg-fetch'

global.fetch = fetchPolyfill

Setup.init()

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
