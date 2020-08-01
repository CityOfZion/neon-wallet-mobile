import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import {ImageLoadEventData} from 'react-native'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Balance} from '~src/models/Balance'
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
  balanceHistory: Balance[] = []

  @HttpExpose()
  accountType: 'standard' | 'watch' | 'legacy' | null = null

  get lastBalance(): Balance | null {
    return this.balanceHistory?.[0]
  }

  get assetSymbol() {
    return this.lastBalance?.assetSymbol ?? null
  }

  get balanceAmount() {
    return this.lastBalance?.amount ?? 0
  }

  getWallet(pool: Wallet[]) {
    return pool.find((it) => it.id === this.idWallet)
  }

  getAccountsWithSameWallet(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.idWallet)
  }

  exchangeBalanceAmount(currency: Currency, exchange: Exchange) {
    const {assetSymbol} = this

    if (!assetSymbol) return null

    const ratio = exchange[assetSymbol]?.to[currency] ?? null

    if (!ratio) return null

    return this.balanceAmount * ratio
  }

  formattedBalanceAmount(
    currency: Currency,
    language: Lang,
    exchange: Exchange
  ) {
    // Fallback when balance amount is 0
    if (this.balanceAmount === 0) {
      return Facade.filter.currency(this.balanceAmount, currency, language)
    }

    const amount = this.exchangeBalanceAmount(currency, exchange)
    if (amount) {
      return Facade.filter.currency(amount, currency, language)
    }

    // Fallback in case it fails to calculate the exchange
    return Facade.filter.currency(
      this.balanceAmount,
      this.assetSymbol,
      language
    )
  }

  async populateBalanceHistory() {
    if (!this.address) return

    const request = new AddressRequest(this.address)
    const response = await request.getBalance()

    this.balanceHistory = response.balance
  }
}
