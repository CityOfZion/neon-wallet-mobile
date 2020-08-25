import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~/src/app/Facade'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionAddressSummary} from '~src/models/TransactionAddressSummary'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

@HttpExclude()
export class TransactionAddressResponse {
  @ResponseExpose('total_pages')
  totalPages: number | null = null

  @ResponseExpose('total_entries')
  totalEntries: number | null = null

  @ResponseExpose('page_size')
  pageSize: number | null = null

  @ResponseExpose('page_number')
  pageNumber: number | null = null

  @ResponseExpose()
  @ResponseSerialize(TransactionAddressSummary)
  entries: TransactionAddressSummary[] = []

  toSenderTransaction(tokensPool: TokenAsset[]) {
    return this.entries.map((it) => {
      const tx = new SenderTransaction()
      tx.transactionHash = it.txid
      tx.senderAddress = it.addressFrom
      tx.receiverAddress = it.addressTo
      tx.sentAt = moment.unix(it.time ?? 0).format()
      const token = tokensPool.find((token) => token.hash === it.asset) ?? null
      tx.token = Facade.utils.clone(token)

      if (tx.token) {
        tx.token.amount = Number(it.amount ?? 0) ?? 0
      }

      return tx
    })
  }

  toTransactionDateGroup(tokensPool: TokenAsset[]) {
    const senderTxs = this.toSenderTransaction(tokensPool)
    return SenderTransaction.toTransactionDateGroup(senderTxs)
  }
}
