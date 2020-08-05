export interface TokenResponse {
  [id: string]: {
    symbol: string
    cryptocompareSymbol?: string
    companyName: string
    type: string
    networks: {
      [id: number]: {
        name: string
        hash: string
        decimals: number
        totalSupply: number
      }
    }
    image?: string
  }
}
