import {wallet} from '@cityofzion/neon-js'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'

import {Facade} from '~src/app/Facade'

const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

export abstract class AsteroidHelper {
  static getKeychainFromMnemonicWords(words: string) {
    const keychain = new SDK.Keychain()
    keychain.importMnemonic(words)
    return keychain
  }

  static generateMnemonicWords() {
    const keychain = new SDK.Keychain()

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  static generateWif(mnemonicWords: string, index: number) {
    const keychain = this.getKeychainFromMnemonicWords(mnemonicWords)

    const childKey = keychain.generateChildKey(
      Facade.app.platform,
      Facade.app.derivationPath.replace(/\?$/, index.toString())
    )

    return childKey.getWIF()
  }

  static generateNeoAccount(mnemonicWords: string, index: number) {
    const wif = this.generateWif(mnemonicWords, index)
    return new wallet.Account(wif)
  }

  static generateNeoAccountFromWif(wif: string) {
    return new wallet.Account(wif)
  }
}
