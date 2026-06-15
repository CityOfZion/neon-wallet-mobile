import * as SecureStore from 'expo-secure-store'

import type { TAccount, TWallet } from '@/types/store'

export class SecureStoreHelper {
  static async saveMnemonic(wallet: TWallet, securityPhrase: string) {
    await SecureStore.setItemAsync(wallet.id, securityPhrase)
  }

  static async getMnemonic(wallet: TWallet) {
    return await SecureStore.getItemAsync(wallet.id)
  }

  static async deleteMnemonic(wallet: TWallet) {
    await SecureStore.deleteItemAsync(wallet.id)
  }

  static async saveKey(account: TAccount, key: string) {
    await SecureStore.setItemAsync(account.id, key)
  }

  static async getKey(account: TAccount) {
    // We need to check if the key is saved by address first for backward compatibility
    const keyByAddress = await SecureStore.getItemAsync(account.address)
    if (keyByAddress) {
      return keyByAddress
    }

    return await SecureStore.getItemAsync(account.id)
  }

  static async deleteKey(account: TAccount) {
    // We need to check if the key is saved by address first for backward compatibility
    const keyByAddress = await SecureStore.getItemAsync(account.address)
    if (keyByAddress) {
      await SecureStore.deleteItemAsync(account.address)
    }

    return await SecureStore.deleteItemAsync(account.id)
  }

  static async savePassword(password: string) {
    return await SecureStore.setItemAsync('password', password)
  }

  static async getPassword() {
    // It is necessary for backward compatibility
    const passcode = await SecureStore.getItemAsync('passcode')
    if (passcode) {
      return passcode.split(',').join('')
    }

    return await SecureStore.getItemAsync('password')
  }

  static async deletePassword() {
    // It is necessary for backward compatibility
    await SecureStore.deleteItemAsync('passcode')

    await SecureStore.deleteItemAsync('password')
  }

  static async saveNfiPasscode(passcode: string) {
    return await SecureStore.setItemAsync('nfiPasscode', passcode)
  }

  static async getNfiPasscode() {
    const passcode = await SecureStore.getItemAsync('nfiPasscode')
    if (!passcode) {
      return null
    }

    return passcode
  }

  static async deleteNfiPasscode() {
    return await SecureStore.deleteItemAsync('nfiPasscode')
  }
}
