import {
  HttpExclude,
  HttpExpose,
  Request,
  ResponseSerialize,
} from '@simpli/serialized-request'
import moment from 'moment'

import {Facade} from '~src/app/Facade'
import {NoPriority, PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {Contact} from '~src/models/redux/Contact'
import {ExchangeHistoryResponse} from '~src/types/exchange'

@HttpExclude()
export class SenderTransaction implements SenderTransactionState {
  @HttpExpose()
  @ResponseSerialize(TokenAsset)
  tokens: TokenAsset[] = []

  @HttpExpose()
  senderAddress: string | null = null

  @HttpExpose()
  receiverAddress: string | null = null

  @ResponseSerialize(PriorityFee)
  @HttpExpose()
  feeAmount: PriorityFee = NoPriority()

  @HttpExpose()
  sentAt: string | null = null // moment format

  @HttpExpose()
  transactionHash: string | null = null

  @HttpExpose()
  isPending: boolean = false

  get token() {
    return this.tokens[0] as TokenAsset | null
  }

  set token(val) {
    if (val) {
      this.tokens[0] = val
    }
  }

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

  get formattedDatetime() {
    return moment(this.sentAt).format(Facade.t('dateFormat.datetime'))
  }

  async populateExchange() {
    if (!this.token || !moment(this.sentAt).isValid()) return

    const params = {
      fsym: this.token.symbol,
      tsyms: Facade.app.currencies,
      ts: moment(this.sentAt).unix(),
    }

    const exchangeResponse = await Request.get(
      'https://min-api.cryptocompare.com/data/pricehistorical',
      {params}
    )
      .name('populateExchange')
      .as<ExchangeHistoryResponse>()
      .getData()

    this.token.exchange = Facade.lodash.mapValues(exchangeResponse, (it) => ({
      to: it,
    }))
  }
}
