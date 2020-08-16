import {wallet} from '@cityofzion/neon-js'
import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {TokenAsset} from '~src/models/TokenAsset'
import {Wallet} from '~src/models/redux/Wallet'
import {AddressRequest} from '~src/models/request/AddressRequest'
import {Exchange} from '~src/types/exchange'

@HttpExclude()
export class Account implements AccountState {
  /**
   * Used as ID
   */
  @HttpExpose()
  address: string | null = null

  /**
   * Used for derivationPath
   */
  @HttpExpose()
  index: number | null = null

  /**
   * Parent reference
   */
  @HttpExpose()
  idWallet: string | null = null

  @HttpExpose()
  srcIcon: ImageLoadEventData | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  currency: Currency | null = null

  @HttpExpose()
  backgroundColor = '#00aaff'

  @ResponseSerialize(TokenAsset)
  tokenAssets: TokenAsset[] = []

  @HttpExpose()
  accountType: WalletType | null = null

  get hasFunds() {
    return Facade.lodash.sumBy(this.tokenAssets, (it) => it.amount ?? 0) > 0
  }

  getWallet(pool: Wallet[]) {
    return pool.find((it) => it.id === this.idWallet)
  }

  getAccountsWithSameWallet(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.idWallet)
  }

  async getWif() {
    return (await Facade.security.loadWif(this.address ?? '')) ?? null
  }

  async getNeoAccount() {
    const wif = await this.getWif()
    return wif ? new wallet.Account(wif) : null
  }

  getBalanceAmountByAsset(assetSymbol: string) {
    const tokenAsset = this.tokenAssets.find((it) => it.symbol === assetSymbol)
    if (!tokenAsset) return null

    return tokenAsset.amount ?? 0
  }

  getBalanceAmount() {
    let amount = 0

    for (const tokenAsset of this.tokenAssets) {
      amount += this.getBalanceAmountByAsset(tokenAsset.symbol) ?? 0
    }

    return amount
  }

  exchangeBalanceAmountByAsset(
    assetSymbol: string,
    currency: Currency,
    exchange: Exchange
  ) {
    const ratio = exchange[assetSymbol]?.to[currency] ?? null
    if (!ratio) return null

    const amount = this.getBalanceAmountByAsset(assetSymbol)
    if (!amount) return null

    return amount * ratio
  }

  exchangeBalanceAmount(currency: Currency, exchange: Exchange) {
    let exchangedAmount = 0

    for (const tokenAsset of this.tokenAssets) {
      exchangedAmount +=
        this.exchangeBalanceAmountByAsset(
          tokenAsset.symbol,
          currency,
          exchange
        ) ?? 0
    }

    return exchangedAmount
  }

  formattedBalanceAmount(
    currency: Currency,
    language: Lang,
    exchange: Exchange
  ) {
    // Fallback when balance amount is 0
    if (this.getBalanceAmount() === 0) {
      return Facade.filter.currency(0, currency, language)
    }

    const amount = this.exchangeBalanceAmount(currency, exchange)

    return Facade.filter.currency(amount, currency, language)
  }

  async populateTokenAssets() {
    if (!this.address) return

    const request = new AddressRequest(this.address)
    const response = await request.getBalance()

    this.tokenAssets = response.balance
      .map((it) => {
        const {asset, assetSymbol, assetHash} = it

        if (asset && assetSymbol && assetHash) {
          const tokenAsset = new TokenAsset(asset, assetSymbol, assetHash)
          tokenAsset.holding = it.unspent.length
          tokenAsset.amount = it.amount ?? 0
          return tokenAsset
        }

        return null
      })
      .filter((it) => it) as TokenAsset[]
  }

  static generateTokenAssetsFromPool(pool: Account[]) {
    // Flat balances of all accounts
    const tokenAssets = Facade.lodash.flatMap(pool, (it) => it.tokenAssets)

    // Discover all assets in this wallet
    const assets = Facade.lodash.uniq(tokenAssets.map((it) => it.symbol))

    const groupedTokenAssets: TokenAsset[] = []

    for (const assetSymbol of assets) {
      const filteredTokenAssets = tokenAssets.filter(
        (it) => it.symbol === assetSymbol
      )

      const firstOne = filteredTokenAssets[0]
      if (!firstOne) continue

      const {name, symbol, hash} = firstOne

      const tokenAsset = new TokenAsset(name, symbol, hash)

      tokenAsset.holding = Facade.lodash.sumBy(
        filteredTokenAssets,
        (it) => it.holding
      )

      tokenAsset.amount = Facade.lodash.sumBy(
        filteredTokenAssets,
        (it) => it.amount
      )

      groupedTokenAssets.push(tokenAsset)
    }

    return groupedTokenAssets
  }
}
