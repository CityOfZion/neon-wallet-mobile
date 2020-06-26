export class Account {
  icon: string = ''
  title: string | null = null
  balance: number = 0
  address: string | null = null
  backgroundColor: string = ''

  constructor(
    icon: string,
    title: string,
    balance: number,
    address: string,
    backgroundColor: string
  ) {
    this.icon = icon
    this.title = title
    this.balance = balance
    this.address = address
    this.backgroundColor = backgroundColor
  }
}
