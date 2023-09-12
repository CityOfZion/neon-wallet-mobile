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

  static async saveKey(address: string, key: string) {
    await SecureStore.setItemAsync(address, key)
  }

  static async loadKey(address: string) {
    return await SecureStore.getItemAsync(address)
  }

  static async removeKey(address: string) {
    return await SecureStore.deleteItemAsync(address)
  }

  static async savePasscode(passcode: number[]) {
    return await SecureStore.setItemAsync('passcode', passcode.join(','))
  }

  static async loadPasscode() {
    return (await SecureStore.getItemAsync('passcode'))?.split(',').map(it => Number(it)) ?? null
  }

  static async removePasscode() {
    return await SecureStore.deleteItemAsync('passcode')
  }
}
