import {TokenValue} from '~src/models/TokenValue'

export class TokenBalance {
  assets: TokenValue[]

  get totalValue() {
    if (!this.assets.length) return 0

    return this.assets
      .map((t) => t.holding * t.value)
      .reduce((a, b) => a + b)
  }

  constructor(assets: TokenValue[]) {
    this.assets = assets
  }
}
