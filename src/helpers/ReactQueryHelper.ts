import { QueryClient } from '@tanstack/react-query'

import { buildQueryKeyBalance } from '@/hooks/useBalances'
import { buildTransactionsQueryKey } from '@/hooks/useTransactionsQuery'
import { buildVoteNeo3GetVoteDetailsByAddressQueryKey } from '@/hooks/useVoteNeo3'

import type { TNetwork } from '@/types/blockchain'
import type { IAccountState } from '@/types/store'

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

  static invalidateTransactionQueries = (account: IAccountState, network: TNetwork) => {
    this.client.removeQueries({
      queryKey: buildQueryKeyBalance(account.address, account.blockchain, network),
    })

    this.client.removeQueries({
      queryKey: buildTransactionsQueryKey(account.blockchain, account.address, network),
    })

    this.client.removeQueries({
      queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network: network, address: account.address }),
      type: 'all',
    })
  }
}
