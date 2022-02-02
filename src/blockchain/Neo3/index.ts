import {DoraSDKProvider} from './providers/DoraSDKProviderNeo3'

import {ContractInvocationMulti} from '~/src/helpers/NeonWcAdapter'
import {IBlockchainService} from '~src/blockchain'
export type TNeo3Provider = 'doraSDK'
export function Neo3ProviderOptions(option: TNeo3Provider) {
  switch (option) {
    case 'doraSDK':
      return new DoraSDKProvider()

    default:
      return new DoraSDKProvider()
  }
}
