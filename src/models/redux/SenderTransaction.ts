import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {PriorityFee} from "~src/models/PriorityFee";

@HttpExclude()
export class SenderTransaction implements SenderTransactionState {
  @HttpExpose()
  account: Account | null = null

  @HttpExpose()
  token: TokenAsset | null = null

  @HttpExpose()
  receiverAddress: string | null = null

  @HttpExpose()
  feeAmount: PriorityFee | null = null

  @HttpExpose()
  sentAt: string | null = null

  @HttpExpose()
  transactionHash: string | null = null
}
