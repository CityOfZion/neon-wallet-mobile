declare module 'react-native-native-neo-bindings' {
  const decryptNep2: (key: string, password: string) => Promise<string>
  export const decryptNep2IOS: (
    key: string,
    password: string,
    callback: (wif: string) => void
  ) => void
  export default decryptNep2
}
