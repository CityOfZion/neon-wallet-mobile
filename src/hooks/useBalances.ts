import { useCallback, useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { QueryClient } from '@tanstack/react-query'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { match } from 'ts-pattern'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { TokenHelper } from '@/helpers/TokenHelper'

import { useCurrencyRatio } from './useCurrencyRatio'
import { fetchExchange } from './useExchanges'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHiddenTokensByBlockchainSelector } from './useUtilitySelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type {
  TBalance,
  TTokenBalance,
  TUseBalanceOptionShowType,
  TUseBalanceResult,
  TUseBalancesFetchResult,
  TUseBalancesOptions,
  TUseBalancesParams,
  TUseBalancesResult,
} from '@/types/query'
import type { TCurrency, THiddenTokenByBlockchain } from '@/types/store'

export function buildQueryKeyBalance(
  address: string,
  blockchain: TBlockchainServiceKey,
  network: TNetwork,
  currency?: TCurrency,
  hasCurrencyRatio?: boolean
) {
  const key: any[] = ['balance', address, blockchain, network]

  if (currency) {
    key.push(currency)

    if (hasCurrencyRatio !== undefined) {
      key.push(hasCurrencyRatio)
    }
  }

  return key
}

const fetchBalance = async (
  param: TUseBalancesParams,
  network: TNetwork,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
): Promise<TUseBalancesFetchResult> => {
  try {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[param.blockchain]
    const balance = await service.blockchainDataService.getBalance(param.address)
    const tokens = balance.map(balance => balance.token)
    const exchange = await fetchExchange(param.blockchain, tokens, network, queryClient, currency, currencyRatio)
    const tokensBalancesMap: Map<string, TTokenBalance> = new Map()

    await Promise.allSettled(
      balance.map(async balance => {
        const exchangeConvertedPrice = ExchangeHelper.getExchangeConvertedPrice(
          balance.token.hash,
          param.blockchain,
          exchange
        )

        const amount = BSBigNumberHelper.format(balance.amount, { decimals: balance.token.decimals })
        const amountNumber = NumberHelper.number(amount)
        const exchangeAmount = amountNumber * exchangeConvertedPrice

        tokensBalancesMap.set(service.tokenService.normalizeHash(balance.token.hash), {
          token: { ...balance.token, blockchain: param.blockchain },
          blockchain: param.blockchain,
          amount,
          amountNumber,
          exchangeAmount,
          exchangeConvertedPrice,
        })
      })
    )

    return {
      address: param.address,
      blockchain: param.blockchain,
      tokensBalancesMap,
    }
  } catch {
    return {
      address: param.address,
      blockchain: param.blockchain,
      tokensBalancesMap: new Map(),
    }
  }
}

const fixBalanceResult = (
  result: TUseBalancesFetchResult,
  showType: TUseBalanceOptionShowType,
  hiddenTokensByBlockchain: THiddenTokenByBlockchain
): TBalance => {
  const tokensBalancesMapClone = cloneDeep(result.tokensBalancesMap)
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[result.blockchain]
  const mandatorySymbols = TokenHelper.mandatorySymbolsMap.get(result.blockchain) || []

  mandatorySymbols.forEach(symbol => {
    const token = TokenHelper.getTokenBySymbol(symbol, result.blockchain)
    if (!token) return

    if (tokensBalancesMapClone.has(token.hash)) return

    tokensBalancesMapClone.set(token.hash, {
      amountNumber: 0,
      amount: '0',
      exchangeAmount: 0,
      exchangeConvertedPrice: 0,
      blockchain: result.blockchain,
      token,
    })
  })

  const hiddenTokens = hiddenTokensByBlockchain[result.blockchain]
  let tokensBalances: TTokenBalance[] = []

  match(showType)
    .with('active', () => {
      hiddenTokens?.forEach(tokenHash => {
        tokensBalancesMapClone.delete(service.tokenService.normalizeHash(tokenHash))
      })

      tokensBalances = Array.from(tokensBalancesMapClone.values())
    })
    .otherwise(() => {
      hiddenTokens?.forEach(tokenHash => {
        const tokenBalance = tokensBalancesMapClone.get(service.tokenService.normalizeHash(tokenHash))

        if (!tokenBalance) return

        tokensBalances.push(tokenBalance)
      })
    })

  return {
    address: result.address,
    blockchain: result.blockchain,
    tokensBalances,
    tokensBalancesMap: tokensBalancesMapClone,
    exchangeTotal: tokensBalances.reduce((acc, tokenBalance) => acc + tokenBalance.exchangeAmount, 0),
  }
}

export function useBalances(params: TUseBalancesParams[], options?: TUseBalancesOptions): TUseBalancesResult {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const queryClient = useQueryClient()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const { showType = 'active', queryOptions } = options || {}
  const hasCurrencyRatio = typeof currencyRatio === 'number'

  return useQueries({
    queries: params.map(param => {
      const network = selectedNetworkByBlockchain[param.blockchain]

      return {
        queryKey: buildQueryKeyBalance(param.address, param.blockchain, network, currency, hasCurrencyRatio),
        queryFn: fetchBalance.bind(null, param, network, queryClient, currency, currencyRatio || 0),
        enabled: !isCurrencyRatioLoading && hasCurrencyRatio,
        ...queryOptions,
      }
    }),
    combine: results => {
      const isLoading = isCurrencyRatioLoading || results.some(result => result.isLoading)
      const data: TBalance[] = []
      let exchangeTotal = 0

      if (!isLoading) {
        results.forEach(result => {
          if (!result.data) return

          data.push(fixBalanceResult(result.data, showType, hiddenTokensByBlockchain))
        })

        exchangeTotal = data.reduce((accumulator, result) => accumulator + (result.exchangeTotal || 0), 0)
      }

      return {
        data,
        isLoading,
        exchangeTotal,
        refetch: async () => {
          await Promise.all(results.map(result => result.refetch()))
        },
        isRefetching: results.some(result => result.isRefetching),
      }
    },
  })
}

export function useBalance(
  balanceParams: TUseBalancesParams | undefined,
  options?: TUseBalancesOptions
): TUseBalanceResult {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const queryClient = useQueryClient()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()

  const params = balanceParams || { address: '', blockchain: 'neo3' }
  const network = selectedNetworkByBlockchain[params.blockchain]
  const { showType = 'active', queryOptions } = options || {}
  const hasCurrencyRatio = typeof currencyRatio === 'number'

  const query = useQuery({
    queryKey: buildQueryKeyBalance(params.address, params.blockchain, network, currency, hasCurrencyRatio),
    queryFn: fetchBalance.bind(null, params, network, queryClient, currency, currencyRatio || 0),
    enabled: !!balanceParams && !isCurrencyRatioLoading && hasCurrencyRatio,
    ...queryOptions,
  })

  const data = useMemo<TBalance | undefined>(() => {
    if (!query.data) return undefined
    return fixBalanceResult(query.data, showType, hiddenTokensByBlockchain)
  }, [query.data, showType, hiddenTokensByBlockchain])

  return {
    ...query,
    data,
  }
}

export const useLazyBalance = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { hiddenTokensByBlockchain } = useHiddenTokensByBlockchainSelector()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()

  const hasCurrencyRatio = typeof currencyRatio === 'number'

  const getBalance = useCallback(
    async (accountParams: TUseBalancesParams, options?: TUseBalancesOptions) => {
      const { showType = 'active', queryOptions } = options || {}
      const network = selectedNetworkByBlockchain[accountParams.blockchain]

      const data = await queryClient.ensureQueryData({
        queryKey: buildQueryKeyBalance(
          accountParams.address,
          accountParams.blockchain,
          network,
          currency,
          hasCurrencyRatio
        ),
        queryFn: fetchBalance.bind(null, accountParams, network, queryClient, currency, currencyRatio || 0),
        enabled: !isCurrencyRatioLoading && hasCurrencyRatio,
        ...queryOptions,
      })

      return data ? fixBalanceResult(data, showType, hiddenTokensByBlockchain) : undefined
    },
    [
      currency,
      currencyRatio,
      hasCurrencyRatio,
      hiddenTokensByBlockchain,
      isCurrencyRatioLoading,
      queryClient,
      selectedNetworkByBlockchain,
    ]
  )

  return { getBalance }
}
