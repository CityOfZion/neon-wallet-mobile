import {
  HttpExclude,
  HttpExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Contact} from '~src/models/redux/Contact'

@HttpExclude()
export class SenderTransaction implements SenderTransactionState {
  @HttpExpose()
  @ResponseSerialize(TokenAsset)
  token: TokenAsset | null = null

  @HttpExpose()
  senderAddress: string | null = null

  @HttpExpose()
  receiverAddress: string | null = null

  @ResponseSerialize(PriorityFee)
  @HttpExpose()
  feeAmount: PriorityFee | null = null

  @HttpExpose()
  sentAt: string | null = null // moment format

  @HttpExpose()
  transactionHash: string | null = null

  @HttpExpose()
  isPending: boolean = false

  isSentBy(address: string) {
    return this.senderAddress === address
  }

  isReceivedBy(address: string) {
    return this.receiverAddress === address
  }

  doSenderHasContactName(contactsPool: Contact[]) {
    return contactsPool.find((it) => it.address === this.senderAddress)
  }

  doReceiverHasContactName(contactsPool: Contact[]) {
    return contactsPool.find((it) => it.address === this.receiverAddress)
  }

  senderAddressOrContactName(contactsPool: Contact[]) {
    const contact = contactsPool.find((it) => it.address === this.senderAddress)

    if (contact) {
      return contact.name
    }

    return this.senderAddress
  }

  receiverAddressOrContactName(contactsPool: Contact[]) {
    const contact = contactsPool.find(
      (it) => it.address === this.receiverAddress
    )

    if (contact) {
      return contact.name
    }

    return this.receiverAddress
  }

  isDatetimeValid() {
    return moment(this.sentAt).isValid()
  }

  get formattedTime() {
    return moment(this.sentAt).format(Facade.t('dateFormat.time'))
  }

  get formattedDate() {
    return moment(this.sentAt).format(Facade.t('dateFormat.datePretty'))
  }

  static toTransactionDateGroup(senderTransactions: SenderTransaction[]) {
    return Facade.lodash
      .chain(senderTransactions)
      .groupBy((it) => it.formattedDate)
      .map((transactions, date) => new TransactionDateGroup(date, transactions))
      .sortBy((it) => -moment(it.date).unix())
      .value()
  }
}
