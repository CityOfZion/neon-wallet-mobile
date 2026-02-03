import { useCallback } from 'react'

import type { QueryFilters } from '@tanstack/react-query'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'

export function useRefetch(filters?: QueryFilters) {
  const queryClient = useQueryClient()

  const isRefetching = useIsFetching({ ...filters, predicate: query => query.state.status !== 'pending' })

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ ...filters, refetchType: 'all' })
  }, [queryClient, filters])

  return {
    refetch,
    isRefetching: isRefetching > 0,
  }
}
