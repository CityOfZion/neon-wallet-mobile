import lodash from 'lodash'
import { useCallback, useState } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'
import { useSelector } from 'react-redux'

import { blockchainList, blockchainServices } from '../blockchain'
import { RootState } from '../store/RootStore'
import { MultiExchange, UseExchangeResult } from '../types/query'

export const fetchExchanges = async (currency: string): Promise<MultiExchange> => {
  const exchanges = await Promise.all(
    blockchainList.map(async blockchain => ({
      [blockchain]: await blockchainServices[blockchain].getExchange(currency),
    }))
  )

  return lodash.merge({}, ...exchanges)
}

export function useExchange(
  queryOptions?: Omit<UseQueryOptions<MultiExchange, unknown, MultiExchange, string[]>, 'queryKey' | 'queryFn'>
): UseExchangeResult {
  const currency = useSelector((state: RootState) => state.settings.currency)

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
