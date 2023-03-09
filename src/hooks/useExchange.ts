import lodash from 'lodash'
import { useCallback, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'
import { useSelector } from 'react-redux'

import { ExchangeInfo } from '../models/response/ExchangeInfo'
import { RootState } from '../store/RootStore'
import { MultiExchange, UseExchangeResult } from '../types/query'
import { useBlockchainServiceUtils } from './useBlockchainServices'

type ExchangeInfoByKey = Record<string, ExchangeInfo[]>

export function useExchange(
  queryOptions?: Omit<UseQueryOptions<MultiExchange, unknown, MultiExchange, string[]>, 'queryKey' | 'queryFn'>
): UseExchangeResult {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { getBlockchainServices } = useBlockchainServiceUtils()

  const fetchExchanges = useCallback(
    async (currency: string): Promise<MultiExchange> => {
      const services = getBlockchainServices()

      const promises = services.map(
        async (service): Promise<ExchangeInfoByKey> => ({
          [service.key]: await service.getExchange(currency),
        })
      )

      const exchanges = await Promise.allSettled(promises)
      const exchangesFiltered = exchanges
        .filter((exchange): exchange is PromiseFulfilledResult<ExchangeInfoByKey> => exchange.status === 'fulfilled')
        .map(exchange => exchange.value)

      return lodash.merge({}, ...exchangesFiltered)
    },
    [getBlockchainServices]
  )

  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false)

  const { refetch, ...rest } = useQuery(['exchange'], () => fetchExchanges(currency), queryOptions)

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
