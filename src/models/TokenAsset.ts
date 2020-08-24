import * as Image from '~src/assets/nep5/png'
import {Currency} from '~src/enums/Currency'
import {Exchange} from '~src/types/exchange'

export class TokenAsset {
  name: string
  symbol: string
  hash: string
  amount: number = 0

  constructor(name: string, symbol: string, hash: string) {
    this.name = name
    this.symbol = symbol
    this.hash = hash
  }

  get color() {
    if (this.symbol === 'NEO') return 'primary'
    if (this.symbol === 'GAS') return 'secondary'

    return '#cccccc'
  }

  get srcIcon() {
    return (Image as any)[this.symbol] ?? Image['NEO']
  }

  exchange(currency: Currency, exchange: Exchange) {
    const {symbol} = this
    if (!symbol) return null

    const ratio = exchange[symbol]?.to[currency] ?? null
    if (!ratio) return null

    const amount = this.amount ?? 0

    return amount * ratio
  }
}
