import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

@HttpExclude()
export class Attribute {
  @HttpExpose()
  usage: string | null = null

  @HttpExpose()
  data: number | null = null
}
