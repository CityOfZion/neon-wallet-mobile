import {wallet} from '@cityofzion/neon-js'
import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Balance} from '~src/models/Balance'
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

  @HttpExpose()
  @ResponseSerialize(Balance)
  balanceTokenAssets: Balance[] = []

  @HttpExpose()
  accountType: WalletType | null = null

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
    const balance = this.balanceTokenAssets.find(
      (it) => it.assetSymbol === assetSymbol
    )
    if (!balance) return null

    return balance.amount ?? 0
  }

  getBalanceAmount() {
    let amount = 0

    for (const balance of this.balanceTokenAssets) {
      const asset = balance.assetSymbol ?? ''
      amount += this.getBalanceAmountByAsset(asset) ?? 0
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

    for (const balance of this.balanceTokenAssets) {
      const asset = balance.assetSymbol ?? ''
      exchangedAmount +=
        this.exchangeBalanceAmountByAsset(asset, currency, exchange) ?? 0
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

  async populateBalanceTokens() {
    if (!this.address) return

    const request = new AddressRequest(this.address)
    const response = await request.getBalance()

    this.balanceTokenAssets = response.balance
  }

  async generateTokenAssets() {
    await this.populateBalanceTokens()

    return this.balanceTokenAssets
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

  static async generateTokenAssetsFromPool(pool: Account[]) {
    const promises = pool.map((it) => it.populateBalanceTokens())
    await Promise.all(promises)

    // Flat balances of all accounts
    const balances = Facade.lodash.flatMap(pool, (it) => it.balanceTokenAssets)

    // Discover all assets in this wallet
    const assets = Facade.lodash.uniq(
      balances.map((it) => it.assetSymbol ?? '').filter((it) => it)
    )

    const tokenAssets: TokenAsset[] = []

    for (const assetSymbol of assets) {
      const filteredBalances = balances.filter(
        (it) => it.assetSymbol === assetSymbol
      )

      const firstBalance = filteredBalances[0]

      if (firstBalance) {
        const {asset, assetSymbol, assetHash} = firstBalance

        if (asset && assetSymbol && assetHash) {
          const tokenAsset = new TokenAsset(asset, assetSymbol, assetHash)

          tokenAsset.holding = Facade.lodash.sumBy(
            filteredBalances,
            (it) => it.unspent.length
          )

          tokenAsset.amount = Facade.lodash.sumBy(
            filteredBalances,
            (it) => it.amount ?? 0
          )

          tokenAssets.push(tokenAsset)
        }
      }
    }

    return tokenAssets
  }
}
