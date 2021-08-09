import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Contact implements ContactState {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  addresses: string[] = []

  @HttpExpose()
  address: string | null = null

  adaptNewFormat() {
    if (this.address && !this.addresses) {
      this.addresses = []
      this.addresses.push(this.address)
    }
  }
}
