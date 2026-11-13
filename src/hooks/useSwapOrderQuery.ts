import type { TSwapApiGetOrdersByAddressParams, TSwapResult } from '@cityofzion/bs-multichain'
import { SwapOrchestrator } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

export const PENDING_SWAP_STATUSES: TSwapResult['status'][] = ['confirming', 'exchanging']

export const useSwapOrderQuery = (orderId?: string) => {
  return useQuery({
    queryKey: ['swap-order', orderId],
    queryFn: () => SwapOrchestrator.getOrder(orderId!, BlockchainServiceHelper.bsAggregator),
    enabled: !!orderId,
    staleTime: 0,
    // Keeps polling while the swap is still in progress
    refetchInterval: query => {
      const status = query.state.data?.status
      return status && PENDING_SWAP_STATUSES.includes(status) ? 4000 : false
    },
  })
}

export const useSwapOrdersByAddressQuery = ({
  address,
  limit,
  offset,
  enabled = true,
}: Partial<TSwapApiGetOrdersByAddressParams> & { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['swap-orders-by-address', address, limit, offset],
    queryFn: () => SwapOrchestrator.getOrdersByAddress({ address: address!, limit, offset }),
    enabled: !!address && enabled,
  })
}
