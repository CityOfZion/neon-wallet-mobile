import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Script {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  invocation: string | null = null

  @HttpExpose()
  verification: string | null = null
}
