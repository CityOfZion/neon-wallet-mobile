import * as SecureStore from 'expo-secure-store'

export abstract class SecurityHelper {
  static async saveMnemonic(idWallet: string, securityPhrase: string) {
    await SecureStore.setItemAsync(idWallet, securityPhrase)
  }

  static async loadMnemonic(idWallet: string) {
    return await SecureStore.getItemAsync(idWallet)
  }

  static async removeMnemonic(idWallet: string) {
    await SecureStore.deleteItemAsync(idWallet)
  }

  static async saveWif(address: string, wif: string) {
    await SecureStore.setItemAsync(address, wif)
  }

  static async loadWif(address: string) {
    return await SecureStore.getItemAsync(address)
  }

  static async removeWif(address: string) {
    return await SecureStore.getItemAsync(address)
  }
}
