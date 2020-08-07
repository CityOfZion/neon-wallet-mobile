import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {Wallet} from '~src/models/redux/Wallet'
import {Exchange} from '~src/types/exchange'

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

  @HttpExpose()
  tokens: TokenAsset[] = []

  @HttpExpose()
  pendingTransactions: SenderTransaction[] = []
}
