import { BlockchainServiceKey } from '~src/blockchain'
import { ExchangeInfo } from '../models/response/ExchangeInfo'
import { BalanceInfo } from '../models/response/BalanceInfo'
import { QueryKey, UseQueryOptions } from 'react-query'

type BaseResult = {
  isLoading: boolean
  isRefetchingByUser: boolean
  refetch: () => Promise<void>
}

export type BaseOptions<T = unknown> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, 'queryKey' | 'queryFn'>

export type Exchange = ExchangeInfo
export type MultiExchange = Record<BlockchainServiceKey, Exchange[]>

export type TokenBalance = BalanceInfo & { blockchain: BlockchainServiceKey }
export type Balance = {
  address: string
  tokensBalances: TokenBalance[]
}

export type UseExchangeResult = BaseResult & { data: MultiExchange | undefined }

export type UseBalancesParams = {
  address: string | null
  blockchain: BlockchainServiceKey
}
export type UseUniqueBalancesResult = BaseResult & { data: Balance | undefined; type: 'unique' }
export type UseMultipleBalancesResult = BaseResult & {
  data: Balance[]
  findByKey: (key: string) => UseUniqueBalancesResult | undefined
  type: 'multiple'
}
export type UseBalancesResult = UseMultipleBalancesResult | UseUniqueBalancesResult

export type UseUniqueBalanceAndExchangeResult = BaseResult & {
  balance: UseUniqueBalancesResult
  exchange: UseExchangeResult
}
export type UseMultipleBalanceAndExchangeResult = BaseResult & {
  balance: UseMultipleBalancesResult
  exchange: UseExchangeResult
  findByBalanceKey: (key: string) => UseUniqueBalanceAndExchangeResult | undefined
}
export type UseBalanceExchangeResult = UseMultipleBalanceAndExchangeResult | UseUniqueBalanceAndExchangeResult
