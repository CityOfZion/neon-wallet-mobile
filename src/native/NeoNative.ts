import RNNeoSdkBindings from 'react-native-neo-sdk-bindings'

export class NeoNative {
  static async decryptNep2(password: string, key: string): Promise<string> {
    const {wif} = await RNNeoSdkBindings.decryptNep2(key, password)
    return wif
  }
}
