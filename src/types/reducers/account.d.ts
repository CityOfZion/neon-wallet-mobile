import { ImageLoadEventData } from 'react-native'
import { BlockchainServiceKey } from '~/src/blockchain'
import { PendingTransactions } from '~src/models/redux/Account'

export interface AccountState {
  address: string | null
  index: number | null
  idWallet: string | null
  name: string | null
  srcIcon: ImageLoadEventData
  backgroundColor: string | null
  blockchain: BlockchainServiceKey
  pendingTransactions: PendingTransactions[] = []
}
