import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { BlockchainServiceKey } from '../blockchain'
import { TokenAsset } from './TokenAsset'

export type Tokens = Record<
  string,
  {
    symbol: string
    cryptocompareSymbol?: string
    companyName: string
    type: string
    networks: {
      [id: number]: {
        name: string
        hash: string
        decimals: number
        totalSupply: number
      }
    }
    image?: string
  }
>

@HttpExclude()
export class TokenResponse {
  @HttpExpose()
  tokens!: Tokens

  constructor(data: Omit<TokenResponse, 'toTokenAsset'>) {
    Object.assign(this, data)
  }

  toTokenAsset(blockchain: BlockchainServiceKey): TokenAsset[] {
    return Object.values(this.tokens).map(
      token =>
        new TokenAsset(token.companyName, token.symbol, token.networks[1].hash, blockchain, token.networks[1].decimals)
    )
  }
}
