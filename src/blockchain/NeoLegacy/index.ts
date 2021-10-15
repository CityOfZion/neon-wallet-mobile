import {DoraSDKProvider, NeoscanProvider, TNeoLegacyProvider} from './providers'
export type TNeoLegacyProviderOptions = 'neoscan' | 'doraSdk'
export function NeoLegacyProviderOption(
  option: TNeoLegacyProviderOptions
): TNeoLegacyProvider {
  switch (option) {
    case 'neoscan':
      return new NeoscanProvider()
    case 'doraSdk':
      return new DoraSDKProvider()
    default:
      throw new Error('Invalid provider NeoLegacy')
  }
}
