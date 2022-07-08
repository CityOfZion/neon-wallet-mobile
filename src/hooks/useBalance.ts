import { useQuery, UseQueryOptions } from 'react-query'

import { BlockchainServiceKey, blockchainServices } from '../blockchain'
import { Balance, UseBalanceParams } from '../types/balance'

export async function fetchBalance(address: string, blockchain: BlockchainServiceKey): Promise<Balance> {
  const balance = await blockchainServices[blockchain].provider.getBalance(address)

  const mappedBalance = balance.map(balance => ({
    ...balance,
    blockchain,
  }))

  return {
    address,
    tokensBalances: mappedBalance,
  }
}

export const useBalance = <T extends UseBalanceParams>(
  params: T,
  queryOptions?: Omit<UseQueryOptions<Balance, unknown, Balance, string[]>, 'queryKey' | 'queryFn'>
) => {
  const { address, blockchain } = params

  const result = useQuery(['balance', address ?? ''], () => fetchBalance(address ?? '', blockchain), queryOptions)

  return result
}
