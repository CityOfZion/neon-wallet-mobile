import { colors } from '~src/assets/tokens/colors'

export class TokenHelper {
  static getColor(symbol: string) {
    return colors[symbol] ?? `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`
  }
}
