import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {NeoNode} from '~src/models/NeoNode'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Contact} from '~src/models/redux/Contact'
import {Wallet} from '~src/models/redux/Wallet'
import {Exchange} from '~src/types/exchange'

@HttpExclude()
export class App implements AppState {
  @HttpExpose()
  exchange: Exchange = {}

  @HttpExpose()
  tokens: TokenAsset[] = []

  @HttpExpose()
  nodes: NeoNode[] = []

  @HttpExpose()
  wallets: Wallet[] = []

  @HttpExpose()
  accounts: Account[] = []

  @HttpExpose()
  contacts: Contact[] = []

  @HttpExpose()
  preAccount: Account | null = null
}
