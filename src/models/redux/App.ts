import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { AppState } from '~/src/types/reducers/app'
import { Node } from '~src/models/Node'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { Wallet } from '~src/models/redux/Wallet'

@HttpExclude()
export class App implements AppState {

  @HttpExpose()
  wallets: Wallet[] = []

  @HttpExpose()
  accounts: Account[] = []

  @HttpExpose()
  contacts: Contact[] = []
}
