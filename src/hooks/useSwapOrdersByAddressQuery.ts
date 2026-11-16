import type { TSwapApiGetOrdersByAddressParams } from '@cityofzion/bs-multichain'
import { SwapOrchestrator } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

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
