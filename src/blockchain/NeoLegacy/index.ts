import {DoraSDKProvider} from './providers/DoraSDKProvider'
import {NeoscanProvider} from './providers/NeoscanProvider'
type TNeoLegacyProviderOptions = 'neoscan' | 'doraSdk'
export function NeoLegacyProviderOption(option: TNeoLegacyProviderOptions) {
  switch (option) {
    case 'neoscan':
      return new NeoscanProvider()
    case 'doraSdk':
      return new DoraSDKProvider()
    default:
      throw new Error('Invalid provider NeoLegacy')
  }
}
