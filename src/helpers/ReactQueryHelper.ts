import { QueryClient } from '@tanstack/react-query'

import { buildQueryKeyBalance } from '@/hooks/useBalances'
import { buildNeo3VoteGetVoteDetailsByAddressQueryKey } from '@/hooks/useNeo3Vote'
import { buildTransactionsQueryKey } from '@/hooks/useTransactionsQuery'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'

export class ReactQueryHelper {
  static readonly client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        gcTime: Infinity,
        staleTime: 60 * 1000, // 1 minute
      },
    },
  })

  static invalidateTransactionQueries = (address: string, blockchain: TBlockchainServiceKey, network: TNetwork) => {
    this.client.removeQueries({
      queryKey: buildQueryKeyBalance(address, blockchain, network),
    })

    this.client.removeQueries({
      queryKey: buildTransactionsQueryKey({ blockchain, address, network }),
    })

    this.client.removeQueries({
      queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network: network, address }),
      type: 'all',
    })
  }
}
