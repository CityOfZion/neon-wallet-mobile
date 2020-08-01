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
}
