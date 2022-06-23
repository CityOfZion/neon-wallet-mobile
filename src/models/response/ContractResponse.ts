import { HttpExclude, ResponseExpose, ResponseSerialize } from '@simpli/serialized-request'

import { ContractMethod } from '../ContractMethod'

@HttpExclude()
export class ContractResponse {
  @ResponseExpose()
  hash: string | null = null

  @ResponseExpose()
  name: string | null = null

  @ResponseExpose()
  @ResponseSerialize(ContractMethod)
  methods: ContractMethod[] = []
}
