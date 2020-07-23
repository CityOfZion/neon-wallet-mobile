import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {Currency} from '~src/enums/Currency'

@HttpExclude()
export class Account implements AccountState {
  @HttpExpose()
  idWallet: string | null = null

  srcIcon: string | null = null

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
}
