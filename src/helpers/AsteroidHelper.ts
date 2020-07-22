import {wallet} from '@cityofzion/neon-js'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'

import {Facade} from '~src/app/Facade'

const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

export abstract class AsteroidHelper {
  static generateMnemonicWords() {
    const keychain = new SDK.Keychain()

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  static generateNeoAccount(mnemonicWords: string) {
    const wif = this.getWifFromMnemonicWords(mnemonicWords)
    return new wallet.Account(wif)
  }

  static getKeychainFromMnemonicWords(words: string) {
    const keychain = new SDK.Keychain()
    keychain.importMnemonic(words)
    return keychain
  }

  static getWifFromMnemonicWords(words: string) {
    const keychain = this.getKeychainFromMnemonicWords(words)

    const childKey = keychain.generateChildKey(
      Facade.app.platform,
      Facade.app.derivationPath
    )

    return childKey.getWIF()
  }
}
