/* eslint-disable import/first */

const { install } = require('react-native-quick-crypto')
install()

import 'react-native-quick-base64'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import '@walletconnect/react-native-compat'
import '@ethersproject/shims'

import { registerRootComponent } from 'expo'

import { SentryHelper } from './helpers/SentryHelper'
import { App } from './App'

if (typeof Promise.allSettled !== 'function') {
  Promise.allSettled = function (promises) {
    return Promise.all(
      promises.map(promise =>
        Promise.resolve(promise).then(
          value => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected', reason })
        )
      )
    )
  }
}

registerRootComponent(SentryHelper.wrap(App))
