import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { AppState } from '~/src/types/reducers/app'
import { Node } from '~src/models/Node'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { Wallet } from '~src/models/redux/Wallet'
import { MultichainExchange } from '~src/types/exchange'

@HttpExclude()
export class App implements AppState {
  @HttpExpose()
  exchange: MultichainExchange = { neoLegacy: {}, neo3: {} }

  @HttpExpose()
  tokens: TokenAsset[] = []

  @HttpExpose()
  nodes: Node[] = []

  @HttpExpose()
  wallets: Wallet[] = []

  @HttpExpose()
  accounts: Account[] = []

  @HttpExpose()
  contacts: Contact[] = []
}
