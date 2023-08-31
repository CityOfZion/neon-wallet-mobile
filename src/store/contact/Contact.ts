import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { Optional } from '~/src/types/global'
import { ContactAddressesList, ContactState } from '~/src/types/store'

export class Contact implements ContactState {
  id: string
  name: string
  addresses: ContactAddressesList = []

  constructor(data: Optional<ContactState, 'addresses' | 'id'>) {
    this.name = data.name
    this.id = data.id ?? UtilsHelper.uuid()

    if (data.addresses) {
      this.addresses = data.addresses
    }
  }

  /**
   * @deprecated The property "address" has been deprecated because it wasn't adapted to working with multichain
   */
  address: string | null = null

  adaptNewFormat() {
    if (this.address && !this.addresses) {
      this.addresses = [{ address: this.address, blockchain: 'neoLegacy' }]
      return
    }

    if (this.addresses.every(address => typeof address === 'string')) {
      this.addresses = (this.addresses as unknown as string[]).map(address => ({
        address,
        blockchain: 'neoLegacy',
      }))
    }
  }

  get deserialize() {
    const { adaptNewFormat, address, deserialize, ...deserializedContact } = this
    const result: ContactState = deserializedContact
    return result
  }
}
