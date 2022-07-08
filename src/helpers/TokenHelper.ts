import { BlockchainServiceKey } from '../blockchain'

import { colors } from '~src/assets/tokens/colors'
import { icons } from '~src/assets/tokens/icons'

export class TokenHelper {
  static getIcon(symbol: string, blockchain: BlockchainServiceKey) {
    return icons[blockchain][symbol] ?? require('~src/assets/tokens/images/Default.png')
  }

  static getColor(symbol: string) {
    return colors[symbol] ?? `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`
  }
}
