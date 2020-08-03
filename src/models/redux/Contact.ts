import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Contact implements ContactState {
  @HttpExpose()
  name: string = ''

  @HttpExpose()
  address: string = ''
}
