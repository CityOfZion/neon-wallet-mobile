import { DoraSDKProvider } from './providers/DoraSDKProviderNeo3'

export type TNeo3Provider = 'doraSDK'
export function Neo3ProviderOptions(option: TNeo3Provider) {
  switch (option) {
    case 'doraSDK':
      return new DoraSDKProvider()

    default:
      return new DoraSDKProvider()
  }
}
