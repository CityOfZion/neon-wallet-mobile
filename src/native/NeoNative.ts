// @ts-ignore
import RNNeoSdkBindings, { decryptNep2IOS } from 'react-native-neo-sdk-bindings'
export class NeoNative {
  static async decryptNep2(password: string, key: string): Promise<string> {
    const { wif } = await RNNeoSdkBindings.decryptNep2(key, password)
    return wif
  }
  static async decryptNep2IOS(password: string, key: string, callback: (wif: string) => void) {
    return decryptNep2IOS(key, password, callback)
  }
}
