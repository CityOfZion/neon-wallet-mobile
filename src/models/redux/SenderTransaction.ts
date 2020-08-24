import {HttpExclude, HttpExpose, ResponseSerialize} from '@simpli/serialized-request'

import {PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'

@HttpExclude()
export class SenderTransaction implements SenderTransactionState {
  @HttpExpose()
  account: Account | null = null

  @HttpExpose()
  token: TokenAsset | null = null

  @HttpExpose()
  receiverAddress: string | null = null

  @ResponseSerialize(PriorityFee)
  @HttpExpose()
  feeAmount: PriorityFee | null = null

  @HttpExpose()
  sentAt: string | null = null

  @HttpExpose()
  transactionHash: string | null = null
}
