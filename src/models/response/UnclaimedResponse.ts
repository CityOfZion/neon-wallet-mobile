import {HttpExclude, ResponseExpose} from '@simpli/serialized-request'

@HttpExclude()
export class UnclaimedResponse {
  @ResponseExpose()
  address: string | null = null

  @ResponseExpose()
  unclaimed: number | null = null
}
