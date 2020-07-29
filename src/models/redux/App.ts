import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {Exchange} from '~src/types/exchange'
import {Contact} from '~src/models/redux/Contact'

@HttpExclude()
export class App implements AppState {
  @HttpExpose()
  exchange: Exchange = {}

  @HttpExpose()
  wallets: Wallet[] = []

  @HttpExpose()
  accounts: Account[] = []

  @HttpExpose()
  contacts: Contact[] = []
}
