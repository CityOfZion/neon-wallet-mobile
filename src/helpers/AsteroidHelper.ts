import {wallet} from '@cityofzion/neon-js'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'

import {Config} from '~src/app/Config'

const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

export abstract class AsteroidHelper {
  static getKeychainFromMnemonic(words: string) {
    const keychain = new SDK.Keychain()
    keychain.importMnemonic(words)
    return keychain
  }

  static generateMnemonic() {
    const keychain = new SDK.Keychain()
    keychain.generateMnemonic(128) // 12 words

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  static generateWif(mnemonic: string, index: number) {
    const keychain = this.getKeychainFromMnemonic(mnemonic)

    const childKey = keychain.generateChildKey(
      Config.application.platform,
      Config.application.derivationPath.replace(/\?$/, index.toString())
    )

    return childKey.getWIF()
  }

  static generateNeoAccount(mnemonic: string, index: number) {
    const wif = this.generateWif(mnemonic, index)
    return new wallet.Account(wif)
  }

  static generateNeoAccountFromWif(wif: string) {
    return new wallet.Account(wif)
  }
}
