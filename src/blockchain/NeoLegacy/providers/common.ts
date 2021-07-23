import {NeoNode} from '~/src/models/NeoNode'
import {Transaction} from '~/src/models/Transaction'
import {BalanceResponse} from '~/src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '~/src/models/response/UnclaimedResponse'

export interface NeoLegacyProvider {
  getTransaction: (txid: string) => Promise<Transaction>
  getAddressAbstracts: (
    address: string,
    page?: number
  ) => Promise<TransactionAddressResponse>
  getBalance: (address: string) => Promise<BalanceResponse>
  getUnclaimed: (address: string) => Promise<UnclaimedResponse>
  getAllNodes: () => Promise<NeoNode[]>
}
