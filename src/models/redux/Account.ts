import {HttpExclude, HttpExpose} from '@simpli/serialized-request'
import {ImageLoadEventData} from 'react-native'

import {Currency} from '~src/enums/Currency'
import {Wallet} from '~src/models/redux/Wallet'

@HttpExclude()
export class Account implements AccountState {
  @HttpExpose()
  idWallet: string | null = null

  /**
   * Used for derivationPath
   */
  @HttpExpose()
  index: number | null = null

  @HttpExpose()
  srcIcon: ImageLoadEventData | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  balance: number | null = null

  @HttpExpose()
  currency: Currency | null = null

  @HttpExpose()
  address: string | null = null

  @HttpExpose()
  backgroundColor = '#00aaff'

  getWallet(pool: Wallet[]) {
    return pool.find((it) => it.id === this.idWallet)
  }

  getAccountsWithSameWallet(pool: Account[]) {
    return pool.filter((it) => it.idWallet === this.idWallet)
  }
}
