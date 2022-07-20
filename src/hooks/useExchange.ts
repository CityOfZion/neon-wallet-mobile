import lodash from 'lodash'
import { useQuery, UseQueryOptions } from 'react-query'
import { useSelector } from 'react-redux'

import { blockchainList, blockchainServices } from '../blockchain'
import { RootState } from '../store/RootStore'
import { MultiExchange } from '../types/exchange'

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
) {
  const currency = useSelector((state: RootState) => state.settings.currency)

  const { data, ...rest } = useQuery(['exchange'], () => fetchExchanges(currency), queryOptions)

  console.log({ data })

  return {
    exchange: data,
    ...rest,
  }
}
