import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {TransactionClaimable} from '~src/models/TransactionClaimable'

@HttpExclude()
export class ClaimableResponse {
  @ResponseExpose()
  address: string | null = null

  @ResponseExpose()
  unclaimed: number | null = null

  @ResponseExpose()
  @ResponseSerialize(TransactionClaimable)
  claimable: TransactionClaimable[] = []
}
