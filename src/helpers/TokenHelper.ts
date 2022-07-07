import { BlockchainServiceKey, Token } from '../blockchain'
import { TokenAsset } from '../models/TokenAsset'

import { icons } from '~src/assets/tokens/icons'

export class TokenHelper {
  static getIcon(symbol: string, blockchain: BlockchainServiceKey) {
    return icons[blockchain][symbol] ?? require('~src/assets/tokens/images/Default.png')
  }

  static toTokenAsset(tokens: Token[]): TokenAsset[] {
    return tokens.map(
      token => new TokenAsset(token.companyName, token.symbol, token.hash, token.blockchain, token.decimals)
    )
  }
}
