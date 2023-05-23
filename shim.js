const { Platform } = require('react-native')
const { fetch } = require('whatwg-fetch')
require('@walletconnect/react-native-compat')

if (typeof __dirname === 'undefined') global.__dirname = '/'
if (typeof __filename === 'undefined') global.__filename = ''
if (typeof process === 'undefined') {
  global.process = require('process')
} else {
  const bProcess = require('process')
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p]
    }
  }
}

process.browser = false
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer

if (typeof BigInt === 'undefined') global.BigInt = require('big-integer')

global.fetch = fetch

// global.location = global.location || { port: 80 } //@ts-ignore
const isDev = typeof __DEV__ === 'boolean' && __DEV__
process.env['NODE_ENV'] = isDev ? 'development' : 'production'
if (typeof localStorage !== 'undefined') {
  //@ts-ignore
  localStorage.debug = isDev ? '*' : ''
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto')

require('promise.allsettled').shim()

if (Platform.OS === 'android') {
  require('intl')
  require('intl/locale-data/jsonp/en-US')
  require('intl/locale-data/jsonp/pt-BR')
  require('intl/locale-data/jsonp/de')
}
