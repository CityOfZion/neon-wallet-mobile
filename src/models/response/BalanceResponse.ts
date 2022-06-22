import { HttpExclude, ResponseExpose, ResponseSerialize } from '@simpli/serialized-request'

import { Balance } from '~src/models/Balance'

@HttpExclude()
export class BalanceResponse {
  @ResponseExpose()
  address: string | null = null

  @ResponseExpose()
  @ResponseSerialize(Balance)
  balance: Balance[] = []
}
