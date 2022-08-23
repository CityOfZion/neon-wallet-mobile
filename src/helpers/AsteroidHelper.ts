import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'

const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

export const keychain = new SDK.Keychain()

export abstract class AsteroidHelper {
  static getKeychainFromMnemonic(words: string) {
    keychain.importMnemonic(words)
    return keychain
  }

  static generateMnemonic() {
    keychain.generateMnemonic(128) // 12 words
    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }
}
