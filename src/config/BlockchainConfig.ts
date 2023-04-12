import i18n from 'i18n-js'

import { BlockchainServiceKey, TNetwork, TNetworkType } from '../blockchain'

export type TBlockchainNetwork = TNetwork & {
  name: string
  id: string
}

export type TBlockchainNetworks = Record<BlockchainServiceKey, TBlockchainNetwork[]>

export type TBlockchainNetworksURLS = Record<BlockchainServiceKey, Record<TNetworkType, string>>

export type TSelectedBlockchainNetworks = Record<BlockchainServiceKey, TBlockchainNetwork>

export type TAvailableBlockchainNetworks = Record<BlockchainServiceKey, TNetworkType[]>

export type TMandatorySymbols = Record<BlockchainServiceKey, string[]>

export class BlockchainConfig {
  readonly defaultNetworksURLs: TBlockchainNetworksURLS = {
    neo3: {
      mainnet: 'https://mainnet1.neo.coz.io:443',
      testnet: 'https://testnet1.neo.coz.io:443',
      custom: 'http://127.0.0.1:50012',
    },
    neoLegacy: {
      mainnet: 'http://seed9.ngd.network:10332',
      testnet: 'http://seed5.ngd.network:20332',
      custom: '',
    },
  }

  readonly defaultNetworks: TBlockchainNetworks = {
    neo3: [
      {
        id: 'neo3-mainnet',
        type: 'mainnet',
        url: this.defaultNetworksURLs.neo3.mainnet,
        name: 'Mainnet',
      },
      {
        id: 'neo3-testnet',
        type: 'testnet',
        url: this.defaultNetworksURLs.neo3.testnet,
        name: 'Testnet',
      },
    ],
    neoLegacy: [
      {
        id: 'neo-legacy-mainnet',
        type: 'mainnet',
        url: this.defaultNetworksURLs.neoLegacy.mainnet,
        name: 'Mainnet',
      },
      {
        id: 'neo-legacy-testnet',
        type: 'testnet',
        url: this.defaultNetworksURLs.neoLegacy.testnet,
        name: 'Testnet',
      },
    ],
  }

  readonly defaultSelectedNetworks: TSelectedBlockchainNetworks = {
    neo3: this.defaultNetworks.neo3[0],
    neoLegacy: this.defaultNetworks.neoLegacy[0],
  }

  readonly availableNetworks: TAvailableBlockchainNetworks = {
    neo3: ['mainnet', 'testnet', 'custom'],
    neoLegacy: ['mainnet', 'testnet'],
  }

  readonly mandatorySymbols: Record<BlockchainServiceKey, string[]> = {
    neo3: ['NEO', 'GAS', 'FLM', 'GM', 'fUSDT', 'bNEO', 'fWBTC'],
    neoLegacy: [],
  }
}

export const blockchainConfig = new BlockchainConfig()
