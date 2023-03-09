import { BlockchainServiceKey } from '~/src/blockchain'
import { PendingTransactions } from '~src/models/redux/Account'

export interface AccountState {
  address: string | null
  idWallet: string | null
  name: string | null
  backgroundColor: string | null
  blockchain: BlockchainServiceKey
  pendingTransactions: PendingTransactions[] = []
}
