import {HttpExclude, HttpExpose} from '@simpli/serialized-request'
import {ImageLoadEventData} from 'react-native'

import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Balance} from '~src/models/Balance'
import {Wallet} from '~src/models/redux/Wallet'
import {AddressRequest} from '~src/models/request/AddressRequest'

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
  balanceHistory: Balance[] = []

  get lastBalance(): Balance | null {
    return this.balanceHistory[0]
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

  async populateBalanceHistory() {
    if (!this.address) return

    const request = new AddressRequest(this.address)
    const response = await request.getBalance()

    this.balanceHistory = response.balance
  }
}
