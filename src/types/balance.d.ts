import { BalanceInfo } from '../models/response/BalanceInfo'

export type UseBalanceParams = {
  address: string | null
  blockchain: BlockchainServiceKey
}

export type TokenBalance = BalanceInfo & { blockchain: BlockchainServiceKey }

export type Balance = {
  address: string
  tokensBalances: TokenBalance[]
}
