import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {ContractParameter} from './ContractParameter'

@HttpExclude()
export class ContractMethod {
  @ResponseExpose()
  name: string | null = null

  @ResponseExpose()
  @ResponseSerialize(ContractParameter)
  parameters: ContractParameter[] = []
}
