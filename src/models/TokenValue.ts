export class TokenValue {
  name: string
  symbol: string
  holding: number
  value: number
  color: string | null

  constructor(name: string, symbol: string, holding: number, value: number, color: string | null = null) {
    this.name = name
    this.symbol = symbol
    this.holding = holding
    this.value = value
    this.color = color
  }
}
