import { useMemo } from 'react'

import { BSBigNumberHelper, type TBSToken, type TTokenPricesResponse } from '@cityofzion/blockchain-service'
import type { Query, QueryClient } from '@tanstack/react-query'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import lodash from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useCurrencyRatio } from './useCurrencyRatio'
import { useCurrencySelector, useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TExchange, TMultiExchange, TUseExchangeParams, TUseExchangeResult } from '@/types/query'
import type { TCurrency } from '@/types/store'

function buildQueryKey(blockchain: TBlockchainServiceKey, network: TNetwork, currency: TCurrency, token?: TBSToken) {
  const queryKey = ['exchange', blockchain, network, currency]

  if (token) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    queryKey.push(service.tokenService.normalizeHash(token.hash))
  }

  return queryKey
}

function buildExchangeByBlockchainQueryKey(
  blockchain: TBlockchainServiceKey,
  network: TNetwork,
  currency: TCurrency,
  hasCurrencyRatio: boolean
) {
  return ['exchange-by-blockchain', blockchain, network, currency, hasCurrencyRatio]
}

export async function fetchExchange(
  blockchain: TBlockchainServiceKey,
  tokens: TBSToken[],
  network: TNetwork,
  queryClient: QueryClient,
  currency: TCurrency,
  currencyRatio: number
) {
  const queryCache = queryClient.getQueryCache()
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const tokensToFetch = tokens.filter(token => {
    const queryKey = buildQueryKey(blockchain, network, currency, token)
    const query = queryCache.find({ queryKey, exact: true, stale: false })
    const data = query?.state?.data as TExchange | undefined

    return !data || (data.convertedPrice === 0 && data.usdPrice > 0)
  })

  let tokenPrices: TTokenPricesResponse[] = []

  if (tokensToFetch.length > 0) {
    try {
      const newTokenPrices = await service.exchangeDataService.getTokenPrices({ tokens: tokensToFetch })
      tokenPrices = lodash.uniqBy(newTokenPrices, 'token.hash')
    } catch {
      // Empty block
    }
  }

  tokensToFetch.forEach(token => {
    const queryKey = buildQueryKey(blockchain, network, currency, token)
    const tokenPrice = tokenPrices.find(price => service.tokenService.predicateByHash(token, price.token))
    const currentQuery = queryCache.find<TExchange>({ queryKey, exact: true })
    const currentUsdPrice = currentQuery?.state?.data?.usdPrice
    let nextUsdPrice = tokenPrice?.usdPrice

    if (typeof currentUsdPrice === 'number' && currentUsdPrice !== 0 && nextUsdPrice === undefined) {
      return
    }

    if (!nextUsdPrice) {
      nextUsdPrice = 0
    }

    const queryData: TExchange = {
      usdPrice: nextUsdPrice,
      token: tokenPrice?.token || token,
      convertedPrice: nextUsdPrice * currencyRatio,
    }

    const defaultedOptions = queryClient.defaultQueryOptions({ queryKey })

    queryCache.build(queryClient, defaultedOptions).setData(queryData, { manual: true })
  })

  const allQueries = queryCache.findAll({
    queryKey: buildQueryKey(blockchain, network, currency),
  }) as Query<TExchange>[]

  return {
    [blockchain]: new Map(
      allQueries.map(({ state, queryKey: [_key, _blockchain, _network, _currency, token] }) => [token, state.data])
    ) as Map<string, TExchange | undefined>,
  }
}

const emptyObject = {}

export function useExchange(params: TUseExchangeParams[]): TUseExchangeResult {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const queryClient = useQueryClient()
  const { currency } = useCurrencySelector()
  const { isLoading: isCurrencyRatioLoading, data: currencyRatio } = useCurrencyRatio()

  const hasCurrencyRatio = typeof currencyRatio === 'number'

  const tokensToFetchByBlockchain = useMemo<Record<TBlockchainServiceKey, TBSToken[]>>(() => {
    if (params.length === 0) return {} as Record<TBlockchainServiceKey, TBSToken[]>

    return params.reduce(
      (acc, param) => {
        if (acc[param.blockchain]) {
          const noDuplicates = param.tokens.filter(token => !acc[param.blockchain].some(t => t.hash === token.hash))
          acc[param.blockchain].push(...noDuplicates)
        } else {
          acc[param.blockchain] = param.tokens
        }

        return acc
      },
      {} as Record<TBlockchainServiceKey, TBSToken[]>
    )
  }, [params])

  return useQueries({
    queries: Object.entries(tokensToFetchByBlockchain).map(([blockchain, tokens]) => {
      const network = selectedNetworkByBlockchain[blockchain as TBlockchainServiceKey]

      return {
        queryKey: buildExchangeByBlockchainQueryKey(
          blockchain as TBlockchainServiceKey,
          network,
          currency,
          hasCurrencyRatio
        ),
        queryFn: fetchExchange.bind(
          null,
          blockchain as TBlockchainServiceKey,
          tokens,
          network,
          queryClient,
          currency,
          currencyRatio || 0
        ),
        enabled: !isCurrencyRatioLoading && hasCurrencyRatio,
      }
    }),
    combine: result => {
      const data = lodash.assign(emptyObject, ...result.map(query => query.data || {})) as TMultiExchange

      return {
        isLoading: isCurrencyRatioLoading || result.some(query => query.isLoading),
        data,
        convertAmount: (amount: string | number, hash: string, blockchain: TBlockchainServiceKey) => {
          const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(hash, blockchain, data)
          if (convertedPrice === 0) return 0
          return BSBigNumberHelper.fromNumber(amount).multipliedBy(convertedPrice).toNumber()
        },
      }
    },
  })
}
