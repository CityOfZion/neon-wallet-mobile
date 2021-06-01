import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Contact implements ContactState {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  addresses: string[] = []
}
