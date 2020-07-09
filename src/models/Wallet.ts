import {TokenBalance} from '~src/models/TokenBalance'

export class Wallet {
  title: string
  previousAssets: TokenBalance
  currentAssets: TokenBalance
  lastVisitedAt: string

  get previousValue() {
    if (!this.currentAssets.assets.length) return 0

    return this.previousAssets.totalValue
  }

  get currentValue() {
    if (!this.currentAssets.assets.length) return 0

    return this.currentAssets.totalValue
  }

  constructor(
    title: string,
    previousAssets: TokenBalance,
    currentAssets: TokenBalance,
    lastVisitedAt: string
  ) {
    this.title = title
    this.previousAssets = previousAssets
    this.currentAssets = currentAssets
    this.lastVisitedAt = lastVisitedAt
  }
}
