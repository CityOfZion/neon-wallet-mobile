import { useCallback, useMemo } from 'react'

import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import type { QueryClient } from '@tanstack/react-query'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
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
  params: TUseBalancesParams,
  network: TNetwork,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
): Promise<TUseBalancesFetchResult> => {
  const { address, blockchain } = params

  try {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    const balance = await service.blockchainDataService.getBalance(address)
    const tokens = balance.map(balance => balance.token)
    const exchange = await fetchExchange(blockchain, tokens, network, queryClient, currency, currencyRatio)
    const tokensBalancesMap: Map<string, TTokenBalance> = new Map()

    await Promise.allSettled(
      balance.map(async balance => {
        const exchangeConvertedPrice = ExchangeHelper.getExchangeConvertedPrice(
          balance.token.hash,
          blockchain,
          exchange
        )

        const amountBn = new BSBigHumanAmount(balance.amount, balance.token.decimals)
        const amount = amountBn.toFormatted()
        const amountNumber = amountBn.toNumber()
        const exchangeAmount = amountNumber * exchangeConvertedPrice

        tokensBalancesMap.set(TokenHelper.getKey(balance.token.hash, blockchain), {
          token: { ...balance.token, blockchain },
          blockchain,
          amount,
          amountNumber,
          exchangeAmount,
          exchangeConvertedPrice,
        })
      })
    )

    return { address, blockchain, tokensBalancesMap }
  } catch {
    return { address, blockchain, tokensBalancesMap: new Map() }
  }
}

const fixBalanceResult = (
  result: TUseBalancesFetchResult,
  showType: TUseBalanceOptionShowType,
  hiddenTokensByBlockchain: THiddenTokenByBlockchain
): TBalance => {
  const tokensBalancesMapClone = cloneDeep(result.tokensBalancesMap)
  const blockchain = result.blockchain
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const mandatorySymbols = TokenHelper.mandatorySymbolsMap.get(blockchain) || []

  mandatorySymbols.forEach(symbol => {
    const token = TokenHelper.getTokenBySymbol(symbol, blockchain)

    if (!token) return

    const key = TokenHelper.getKey(token.hash, blockchain)

    if (tokensBalancesMapClone.has(key)) return

    tokensBalancesMapClone.set(key, {
      amountNumber: 0,
      amount: '0',
      exchangeAmount: 0,
      exchangeConvertedPrice: 0,
      blockchain,
      token,
    })
  })

  const hiddenTokens = hiddenTokensByBlockchain[blockchain]

  if (hiddenTokens) {
    const keepHidden = showType === 'hidden'

    for (const [key, { token }] of tokensBalancesMapClone) {
      const isHidden = hiddenTokens.some(tokenHash => service.tokenService.predicateByHash(tokenHash, token.hash))

      if (isHidden !== keepHidden) {
        tokensBalancesMapClone.delete(key)
      }
    }
  }

  const tokensBalances = Array.from(tokensBalancesMapClone.values())

  return {
    address: result.address,
    blockchain,
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
