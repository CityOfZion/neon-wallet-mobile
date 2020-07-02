import {registerRootComponent} from 'expo'

import '~src/vendor/window-crypto'
import 'reflect-metadata'

import App from './src/App'
import {Setup} from './src/app/Setup'

Setup.init()

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
