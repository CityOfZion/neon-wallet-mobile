import { BlockchainServiceKey } from '../blockchain'

export interface Token {
  symbol: string
  name: string
  hash: string
  blockchain: BlockchainServiceKey
  decimals: number
}
