import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import * as Image from '~src/assets/nep5/png'
import {Currency} from '~src/enums/Currency'
import {Exchange} from '~src/types/exchange'

@HttpExclude()
export class TokenAsset {
  @HttpExpose()
  name: string

  @HttpExpose()
  symbol: string

  @HttpExpose()
  hash: string

  @HttpExpose()
  amount: number = 0

  @HttpExpose()
  exchange: Exchange | null = null

  constructor(name: string, symbol: string, hash: string) {
    this.name = name
    this.symbol = symbol
    this.hash = hash
  }

  get color() {
    return `#${this.hash.substring(1, 7)}`
  }

  get srcIcon() {
    return (
      (Image as any)[this.symbol] ??
      require('~/src/assets/images/icon-default-nep5.png')
    )
  }

  getCurrencyRatio(currency: Currency, exchange: Exchange) {
    const {symbol} = this
    if (!symbol) return null

    return exchange[symbol]?.to[currency] ?? null
  }

  exchangeToken(currency: Currency, exchange?: Exchange) {
    const exchangeModel = exchange ?? this.exchange
    if (!exchangeModel) return null

    const ratio = this.getCurrencyRatio(currency, exchangeModel)
    if (!ratio) return null

    const amount = this.amount ?? 0

    return amount * ratio
  }
}
