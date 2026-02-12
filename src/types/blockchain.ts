import type { TBSNetwork } from '@cityofzion/blockchain-service'

export type TBlockchainServiceKey =
  | 'neo3'
  | 'neoLegacy'
  | 'ethereum'
  | 'neox'
  | 'polygon'
  | 'base'
  | 'arbitrum'
  | 'solana'

export type TNetwork = { isAutomatic?: boolean } & TBSNetwork

export type TBlockchainImageColor = 'white' | 'default' | 'gray'
