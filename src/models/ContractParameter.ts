import { HttpExclude, ResponseExpose } from '@simpli/serialized-request'

@HttpExclude()
export class ContractParameter {
  @ResponseExpose()
  name: string | null = null

  @ResponseExpose()
  type: string | null = null
}
