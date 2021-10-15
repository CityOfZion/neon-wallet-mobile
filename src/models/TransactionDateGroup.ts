import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import i18n from 'i18n-js'
import _ from 'lodash'
import moment from 'moment'

import {TokenAsset} from '~src/models/TokenAsset'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

@HttpExclude()
export class TransactionDateGroup {
  @HttpExpose()
  date: string | null = null // moment

  // Flat transactions
  @HttpExpose()
  @ResponseSerialize(SenderTransaction)
  transactions: SenderTransaction[] = []

  // Transaction grouped by hash
  @HttpExpose()
  @ResponseSerialize(SenderTransaction)
  groupedTransactions: SenderTransaction[] = []

  constructor(
    date: string | null,
    transactions: SenderTransaction[],
    groupedTransactions: SenderTransaction[] = []
  ) {
    this.date = date
    this.transactions = transactions
    this.groupedTransactions = groupedTransactions
  }

  isDatetimeValid() {
    return moment(this.date).isValid()
  }

  formattedDate() {
    return moment(this.date).format(i18n.t('dateFormat.datePretty'))
  }

  static toTransactionDateGroup(senderTransactions: SenderTransaction[]) {
    return _.chain(senderTransactions)
      .groupBy((it) => it.formattedDate)
      .map((transactions, date) => {
        // Find similar transactions of each group
        // And group it in another layer
        const groups = _.chain(transactions)
          .groupBy((it) => it.transactionHash)
          .map((senderTxs) => {
            const senderTx =
              senderTxs.find(
                (it) =>
                  it.receiverAddress !== 'fees' &&
                  it.receiverAddress !== 'claim'
              ) ?? senderTxs[0]
            senderTx.tokens = senderTxs
              .filter((it) => it.token)
              .map((it) => it.token as TokenAsset)

            return senderTx
          })
          .sortBy((it) => -moment(it.sentAt).unix())
          .value()

        return new TransactionDateGroup(date, transactions, groups)
      })
      .sortBy((it) => -moment(it.date).unix())
      .value()
  }
}
