import { BlockchainServiceKey, IBlockchainService, TNetwork } from '../blockchain'
import { BSNeo3 } from '../blockchain/Neo3/services/BSNeo3'
import { BSNeoLegacy } from '../blockchain/NeoLegacy/services/BSNeoLegacy'

import * as BlockchainIcons from '~src/assets/blockchainIcons'

export type TColorLogo = 'white' | 'default'

export type TGetBlockchainServiceOptions = {
  blockchain: BlockchainServiceKey
  network?: TNetwork
}

export type TGetBlockchainServicesOptions = {
  network?: Record<BlockchainServiceKey, TNetwork>
}

const blockchainServicesByKey: Record<BlockchainServiceKey, IBlockchainService> = {
  neo3: new BSNeo3(),
  neoLegacy: new BSNeoLegacy(),
}

export class BlockchainHelper {
  static getIcon(blockchain: BlockchainServiceKey, color: TColorLogo = 'default') {
    const blockchainWithColor = `${blockchain}${color === 'default' ? '' : color}`
    return (BlockchainIcons as any)[blockchainWithColor] ?? require('~/src/assets/images/icon-default-nep5.png')
  }

  static getBlockchainService(options: TGetBlockchainServiceOptions): IBlockchainService {
    const blockchainService = blockchainServicesByKey[options.blockchain]

    if (options.network) {
      blockchainService.setNetwork(options.network)
    }
    return blockchainService
  }

  static getBlockchainServices(options?: TGetBlockchainServicesOptions): IBlockchainService[] {
    const entries = Object.entries(blockchainServicesByKey) as [BlockchainServiceKey, IBlockchainService][]

    return entries.map(([key, service]) => {
      if (options?.network) service.setNetwork(options.network[key])

      return service
    })
  }

  static isMnemonic = (word: string) => {
    return word.split(' ').length > 1
  }
}
