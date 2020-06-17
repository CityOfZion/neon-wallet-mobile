import {TokenBalance} from '~src/models/TokenBalance'

export class Wallet {
  title: string
  previousAssets: TokenBalance
  currentAssets: TokenBalance

  get previousValue() {
    return this.previousAssets.assets.map(t => t.holding * t.value).reduce((a, b) => a + b)
  }

  get currentValue() {
    return this.currentAssets.assets.map(t => t.holding * t.value).reduce((a, b) => a + b)
  }

  constructor(title: string, previousAssets: TokenBalance, currentAssets: TokenBalance) {
    this.title = title
    this.previousAssets = previousAssets
    this.currentAssets = currentAssets
  }
}
