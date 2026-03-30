import type { TBSNetwork } from '@cityofzion/blockchain-service'

export type TBlockchainServiceKey =
  | 'neo3'
  | 'neoLegacy'
  | 'neox'
  | 'bitcoin'
  | 'solana'
  | 'ethereum'
  | 'polygon'
  | 'base'
  | 'arbitrum'

export type TNetwork = { isAutomatic?: boolean } & TBSNetwork

export type TBlockchainImageColor = 'default' | 'white' | 'gray'
