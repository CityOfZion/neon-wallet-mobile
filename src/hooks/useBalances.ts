import { useMemo } from 'react'
import { useQueries, UseQueryOptions, QueryKey } from 'react-query'

import { Account } from '../models/redux/Account'
import { Balance, UseBalanceParams } from '../types/balance'
import { fetchBalance } from './useBalance'

export const useBalances = <T extends UseBalanceParams | Account>(
  params: T[],
  queryOptions?: Omit<UseQueryOptions<Balance, unknown, Balance, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const queries = useMemo<UseQueryOptions<Balance, unknown, Balance, QueryKey>[]>(
    () =>
      params.map(param => ({
        queryKey: ['balance', param.address ?? ''],
        queryFn: () => fetchBalance(param.address ?? '', param.blockchain),
        ...queryOptions,
      })),

    [params, queryOptions]
  )

  const results = useQueries(queries)

  const data = useMemo(() => results.flatMap(({ data }) => data).filter((data): data is Balance => !!data), [results])

  return {
    balances: data,
    queryResults: results,
  }
}
