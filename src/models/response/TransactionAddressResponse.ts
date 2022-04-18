import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {UtilsHelper} from '~/src/helpers/UtilsHelper'
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
  transactions: TransactionAddressSummary[] = []

  async toSenderTransaction(tokensPool: TokenAsset[]) {
    const transactions = this.transactions.flatMap((transaction) =>
      transaction.transfers.map((transfer) => {
        const tx = new SenderTransaction()
        tx.transactionHash = transaction.hash
        tx.senderAddress = transfer.from
        tx.receiverAddress = transfer.to
        tx.sentAt = moment.unix(transaction.time ?? 0).format()

        const token =
          tokensPool.find((token) => token.hash === transfer.hash) ?? null
        tx.token = UtilsHelper.clone(token)

        if (tx.token) {
          tx.token.amount = transfer.amount
        }

        return tx
      })
    )

    // Populate exchange for each transaction
    await Promise.all(
      transactions.map((transaction) => transaction.populateExchange())
    )

    return transactions
  }
}
