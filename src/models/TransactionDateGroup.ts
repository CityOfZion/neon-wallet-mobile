import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

export class TransactionDateGroup {
  date: string | null = null // moment
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
}
