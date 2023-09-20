import { NetworkType, Token } from '@cityofzion/blockchain-service'

import { TBlockchainServiceKey } from '../types/blockchain'

export type TBlockchainNetwork = {
  name: string
  id: string
  type: NetworkType
  url?: string
}

export type TBlockchainNetworks = Record<TBlockchainServiceKey, TBlockchainNetwork[]>

export type TSelectedBlockchainNetworks = Record<TBlockchainServiceKey, TBlockchainNetwork>

export type TAvailableBlockchainNetworks = Record<TBlockchainServiceKey, NetworkType[]>

export type TMandatorySymbols = Record<TBlockchainServiceKey, string[]>

export class BlockchainConfig {
  readonly defaultNetworks: TBlockchainNetworks = {
    neo3: [
      {
        id: 'neo3-mainnet',
        type: 'mainnet',
        name: 'Mainnet',
      },
      {
        id: 'neo3-testnet',
        type: 'testnet',
        name: 'Testnet',
      },
    ],
    neoLegacy: [
      {
        id: 'neo-legacy-mainnet',
        type: 'mainnet',
        name: 'Mainnet',
      },
      {
        id: 'neo-legacy-testnet',
        type: 'testnet',
        name: 'Testnet',
      },
    ],
    ethereum: [
      {
        id: 'ethereum-mainnet',
        type: 'mainnet',
        name: 'Mainnet',
      },
      {
        id: 'ethereum-testnet',
        type: 'testnet',
        name: 'Testnet',
      },
    ],
  }

  readonly defaultSelectedNetworks: TSelectedBlockchainNetworks = {
    neo3: this.defaultNetworks.neo3[0],
    neoLegacy: this.defaultNetworks.neoLegacy[0],
    ethereum: this.defaultNetworks.ethereum[0],
  }

  readonly availableNetworks: TAvailableBlockchainNetworks = {
    neo3: ['mainnet', 'testnet', 'custom'],
    neoLegacy: ['mainnet', 'testnet'],
    ethereum: ['mainnet', 'testnet'],
  }

  readonly mandatorySymbols: Record<TBlockchainServiceKey, string[]> = {
    neo3: ['NEO', 'GAS', 'FLM', 'GM', 'fUSDT', 'bNEO', 'fWBTC'],
    neoLegacy: [],
    ethereum: [],
  }

  readonly mainnetTipByBlockchain: Partial<Record<TBlockchainServiceKey, { token: Token; address: string }>> = {
    neo3: {
      address: 'NXWJfovnpRaj2r3yrYQXDMvBLixv9zJZsk',
      token: {
        symbol: 'GAS',
        hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
        decimals: 8,
        name: 'GasToken',
      },
    },
    neoLegacy: {
      address: 'AVav2pJu9S5rpsLyne2iC4vG63ngqT7uv9',
      token: {
        symbol: 'GAS',
        hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
        decimals: 8,
        name: 'GasToken',
      },
    },
  }
}

export const blockchainConfig = new BlockchainConfig()
