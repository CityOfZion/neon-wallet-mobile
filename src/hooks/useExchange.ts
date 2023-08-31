import { Currency, TokenPricesResponse } from '@cityofzion/blockchain-service'
import lodash from 'lodash'
import { useCallback, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { MultiExchange, UseExchangeResult } from '../types/query'

type ExchangeInfoByKey = Record<string, TokenPricesResponse[]>

export function useExchange(
  queryOptions?: Omit<UseQueryOptions<MultiExchange, unknown, MultiExchange, string[]>, 'queryKey' | 'queryFn'>
): UseExchangeResult {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const fetchExchanges = useCallback(async (): Promise<MultiExchange> => {
    const promises = bsAggregator.blockchainServices.map(
      async (service): Promise<ExchangeInfoByKey> => ({
        [service.blockchainName]: await service.exchangeDataService.getTokenPrices(currency as Currency),
      })
    )

    const exchanges = await Promise.allSettled(promises)
    const exchangesFiltered = exchanges
      .filter((exchange): exchange is PromiseFulfilledResult<ExchangeInfoByKey> => exchange.status === 'fulfilled')
      .map(exchange => exchange.value)

    return lodash.merge({}, ...exchangesFiltered)
  }, [currency, bsAggregator])

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false)

  const { refetch, ...rest } = useQuery(['exchange'], () => fetchExchanges(), queryOptions)

  const customRefetch = useCallback(async () => {
    setIsRefetchingByUser(true)

    try {
      await refetch()
    } finally {
      setIsRefetchingByUser(false)
    }
  }, [refetch])

  return {
    ...rest,
    refetch: customRefetch,
    isRefetchingByUser,
  }
}
