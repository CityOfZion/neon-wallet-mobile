import { HttpExclude, HttpExpose } from '@simpli/serialized-request'

import {ContactAddressesList, ContactState} from '~/src/types/reducers/contact'

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
      this.addresses = []
      this.addresses.push({ address: this.address, blockchain: 'neoLegacy' })
    }
    this.adaptToMultichain()
  }
  private adressesIsStringArray(addresses: ContactAddressesList | string[]): addresses is string[] {
    return (
      (addresses as ContactAddressesList)[0].address === undefined ||
      (addresses as ContactAddressesList)[0].blockchain === undefined
    )
  }

  private adaptToMultichain() {
    if (this.adressesIsStringArray(this.addresses)) {
      const addressesStringArray = this.addresses as string[]
      this.addresses = []
      addressesStringArray.forEach(address => {
        this.addresses.push({ address, blockchain: 'neoLegacy' })
      })
    }
  }
}
