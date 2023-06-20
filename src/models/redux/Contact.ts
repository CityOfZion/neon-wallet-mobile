import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import { ContactAddressesList, ContactState } from '~/src/types/reducers/contact'

@HttpExclude()
export class Contact implements ContactState {
  @HttpExpose()
  id: string | null = null

  @HttpExpose()
  name: string | null = null

  @HttpExpose()
  addresses: ContactAddressesList = []

  /**
   * The property "address" has been deprecated because it wasn't adapted to working with multichain
   */
  //@deprecated
  @HttpExpose()
  address: string | null = null

  adaptNewFormat() {
    if (this.address && !this.addresses) {
      this.addresses = [{ addressOrDomain: this.address, blockchain: 'neoLegacy' }]
      return
    }

    if (this.addresses.every(address => typeof address === 'string')) {
      this.addresses = (this.addresses as unknown as string[]).map(address => ({
        addressOrDomain: address,
        blockchain: 'neoLegacy',
      }))
    }
  }

  deserialize() {
    const { adaptNewFormat, address, deserialize, ...deserializedContact } = this
    const result: ContactState = deserializedContact
    return result
  }
}
