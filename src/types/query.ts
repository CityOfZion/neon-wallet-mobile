import type { TBSToken, TPingNetworkResponse, TTokenPricesResponse } from '@cityofzion/blockchain-service'
import type { TBSServiceName } from '@cityofzion/bs-multichain'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'

import type { Optional } from './global'

export type TBaseOptions<T = unknown> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, 'queryKey' | 'queryFn'>

export type TUseCurrencyRatioResult = {
  data: number | undefined
  isLoading: boolean
}

export type TToken = TBSToken & { blockchain: TBSServiceName }

export type TUseExchangeParams = {
  tokens: TBSToken[]
  blockchain: TBSServiceName
}

export type TExchange = TTokenPricesResponse & {
  convertedPrice: number
}
export type TMultiExchange = Record<TBSServiceName, Map<string, TExchange>>
export type TUseExchangeResult = {
  data: TMultiExchange | undefined
  isLoading: boolean
  convertAmount: (amount: string | number, hash: string, blockchain: TBSServiceName) => number
}

export type TTokenBalance = {
  amount: string
  token: TToken
  blockchain: TBSServiceName
  amountNumber: number
  exchangeConvertedPrice: number
  exchangeAmount: number
}
export type TBalance = {
  address: string
  blockchain: TBSServiceName
  tokensBalances: TTokenBalance[]
  tokensBalancesMap: Map<string, TTokenBalance>
  exchangeTotal: number
}

export type TUseBalancesResult = {
  data: TBalance[]
  isLoading: boolean
  exchangeTotal: number
  refetch: () => void
  isRefetching: boolean
}
export type TUseBalanceResult = {
  data: TBalance | undefined
  dataUpdatedAt: number
  isLoading: boolean
  refetch: () => void
  isRefetching: boolean
}

export type TUseBalanceOptionShowType = 'hidden' | 'active'

export type TUseBalancesOptions = {
  showType?: TUseBalanceOptionShowType
  queryOptions?: TBaseOptions<TUseBalancesFetchResult>
}

export type TUseUnclaimedResult = {
  unclaimed: string
  unclaimedNumber: number
  fee: string
  feeNumber: number
}

export type TUseBalancesParams = {
  address: string
  blockchain: TBSServiceName
}

export type TUseBalancesFetchResult = {
  address: string
  blockchain: TBSServiceName
  tokensBalancesMap: Map<string, TTokenBalance>
}

export type TPingNetwork = Optional<TPingNetworkResponse, 'height' | 'latency'>
