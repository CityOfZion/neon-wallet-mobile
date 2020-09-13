import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

@HttpExclude()
export class TransactionDateGroup {
  @HttpExpose()
  date: string | null = null // moment

  @HttpExpose()
  @ResponseSerialize(SenderTransaction)
  transactions: SenderTransaction[] = []

  constructor(date: string | null, transactions: SenderTransaction[]) {
    this.date = date
    this.transactions = transactions
  }

  isDatetimeValid() {
    return moment(this.date).isValid()
  }

  formattedDate() {
    return moment(this.date).format(Facade.t('dateFormat.datePretty'))
  }

  static toTransactionDateGroup(
    senderTransactions: SenderTransaction[],
    format = (st: SenderTransaction) => st.formattedDate
  ) {
    return Facade.lodash
      .chain(senderTransactions)
      .groupBy((it) => format(it))
      .map((transactions, date) => new TransactionDateGroup(date, transactions))
      .sortBy((it) => -moment(it.date).unix())
      .value()
  }
}
