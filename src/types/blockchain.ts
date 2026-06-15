import type { TBSNetwork } from '@cityofzion/blockchain-service'
import type { BSBitcoin } from '@cityofzion/bs-bitcoin'
import type { BSEthereum } from '@cityofzion/bs-ethereum'
import type { BSAggregator, TBSServiceByName } from '@cityofzion/bs-multichain'
import type { BSNeoLegacy } from '@cityofzion/bs-neo-legacy'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import type { BSSolana } from '@cityofzion/bs-solana'
import type { BSStellar } from '@cityofzion/bs-stellar'

export type TBlockchainService =
  | BSNeo3
  | BSNeoLegacy
  | BSNeoX
  | BSSolana
  | BSEthereum<'ethereum'>
  | BSEthereum<'polygon'>
  | BSEthereum<'base'>
  | BSEthereum<'arbitrum'>
  | BSStellar
  | BSBitcoin

export type TBlockchainServiceKey = TBlockchainService['name']

export type TBSAggregator = BSAggregator<TBlockchainService[], TBSServiceByName<TBlockchainService[]>>

export type TNetwork = { isAutomatic?: boolean } & TBSNetwork
