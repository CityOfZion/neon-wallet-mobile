import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'

@HttpExclude()
export class App implements AppState {
  @HttpExpose()
  wallets: Wallet[] = []

  @HttpExpose()
  accounts: Account[] = []
}
