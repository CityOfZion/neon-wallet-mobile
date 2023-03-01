import { useCallback, useMemo, useState } from 'react'
import { useQueries, UseQueryOptions, QueryKey, UseQueryResult } from 'react-query'

import { BlockchainServiceKey } from '../blockchain'
import {
  Balance,
  BaseOptions,
  UseBalancesParams,
  UseMultipleBalancesResult,
  UseUniqueBalancesResult,
  UseBalancesResult,
} from '../types/query'
import { useBlockchainServiceUtils } from './useBlockchainServices'

export function useBalances(params: UseBalancesParams[], queryOptions?: BaseOptions<Balance>): UseMultipleBalancesResult

export function useBalances(params: UseBalancesParams, queryOptions?: BaseOptions<Balance>): UseUniqueBalancesResult

export function useBalances(
  params: UseBalancesParams | UseBalancesParams[],
  queryOptions?: BaseOptions<Balance>
): UseBalancesResult

export function useBalances(
  params: UseBalancesParams | UseBalancesParams[],
  queryOptions?: BaseOptions<Balance>
): UseBalancesResult {
  const { getBlockchainService } = useBlockchainServiceUtils()
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false)

  const fetchBalance = useCallback(
    async (address: string, blockchain: BlockchainServiceKey): Promise<Balance> => {
      const service = getBlockchainService(blockchain)
      const balance = await service.provider.getBalance(address)

      return {
        address,
        tokensBalances: balance,
      }
    },
    [getBlockchainService]
  )

  const generateQuery = useCallback(
    (param: UseBalancesParams): UseQueryOptions<Balance, unknown, Balance, QueryKey> => {
      return {
        queryKey: ['balance', param.address ?? ''],
        queryFn: () => fetchBalance(param.address ?? '', param.blockchain),
        ...queryOptions,
      }
    },
    [queryOptions, fetchBalance]
  )

  const queries = useMemo(() => {
    if (!Array.isArray(params)) return [generateQuery(params)]

    return params.map(param => generateQuery(param))
  }, [params, queryOptions])

  const results = useQueries(queries)

  const refetchWrapper = useCallback((refetch: () => Promise<any>) => {
    return async () => {
      setIsRefetchingByUser(true)

      try {
        await refetch()
      } finally {
        setIsRefetchingByUser(false)
      }
    }
  }, [])

  const generateUniqueBalance = useCallback(
    (result: UseQueryResult<Balance, unknown>): UseUniqueBalancesResult => {
      const refetch = refetchWrapper(result.refetch)

      return {
        ...result,
        refetch,
        isRefetchingByUser,
        type: 'unique',
      }
    },
    [refetchWrapper, isRefetchingByUser]
  )

  const generateMultipleBalance = useCallback(
    (results: UseQueryResult<Balance, unknown>[]): UseMultipleBalancesResult => {
      const isLoading = results.some(({ isLoading }) => isLoading)
      const data = results.flatMap(({ data }) => data).filter((data): data is Balance => !!data)

      const refetch = refetchWrapper(() => Promise.all(results.map(({ refetch }) => refetch())))

      const findByKey = (key: string) => {
        const index = queries.findIndex(({ queryKey }) => queryKey?.includes(key))

        if (index < 0) return

        const result = results[index]

        if (!result) return

        return generateUniqueBalance(result)
      }

      return {
        data,
        isLoading,
        isRefetchingByUser,
        refetch,
        findByKey,
        type: 'multiple',
      }
    },
    [isRefetchingByUser, refetchWrapper]
  )

  const balanceResult = useMemo<UseBalancesResult>(() => {
    if (Array.isArray(params)) {
      return generateMultipleBalance(results)
    }

    return generateUniqueBalance(results[0])
  }, [results, params, generateMultipleBalance, generateUniqueBalance])

  return balanceResult
}
