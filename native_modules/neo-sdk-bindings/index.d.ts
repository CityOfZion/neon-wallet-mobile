export const decryptNep2Android: (key: string, password: string) => Promise<string>
export const decryptNep2LegacyAndroid: (key: string, password: string) => Promise<string>
export const decryptNep2IOS: (
  key: string,
  password: string,
  callback: (wif: string) => void
) => Promise<void>
export const decryptNep2LegacyIOS: (
  key: string,
  password: string,
  callback: (wif: string) => void
) => Promise<void>
export const Base58DecodeAndroid: (key: string) => Promise<Uint8Array>
