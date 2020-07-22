import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Wallet {
  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  securityPhrase: string | null = null

  @HttpExpose()
  passphrase: string | null = null
}
