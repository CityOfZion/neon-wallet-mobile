import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

@HttpExclude()
export class TransactionClaimed {
  @HttpExpose()
  txids: string[] = []
}
