export class Contact {
  name: string
  address: string
  onClick?: (contact: Contact) => void

  constructor(name: string, address: string) {
    this.name = name
    this.address = address
  }
}
