import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {TransactionClaimed} from '~src/models/TransactionClaimed'

@HttpExclude()
export class ClaimedResponse {
  @ResponseExpose()
  address: string | null = null

  @ResponseExpose()
  @ResponseSerialize(TransactionClaimed)
  claimed: TransactionClaimed[] = []
}
