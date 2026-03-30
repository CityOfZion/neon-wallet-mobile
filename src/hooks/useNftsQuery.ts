import { useMemo } from 'react'

import { hasNft } from '@cityofzion/blockchain-service'
import type { QueryClient } from '@tanstack/react-query'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from './useSettingsSelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

const buildUniqueQueryKey = (
  blockchain: TBlockchainServiceKey,
  network: TNetwork,
  tokenHash?: string,
  collectionHash?: string
) => ['nft', blockchain, network, tokenHash, collectionHash]

async function fetchNfts(
  account: TAccount,
  network: TNetwork,
  queryClient: QueryClient,
  pageParam: string | undefined
) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

  if (!hasNft(blockchainService)) return { items: [] }

  const response = await blockchainService.nftDataService.getNftsByAddress({
    address: account.address,
    nextPageParams: pageParam,
  })

  const queryCache = queryClient.getQueryCache()

  response.items.forEach(item => {
    const queryKey = buildUniqueQueryKey(account.blockchain, network, item.hash, item.collection?.hash)
    const defaultedOptions = queryClient.defaultQueryOptions({ queryKey })

    queryCache.build(queryClient, defaultedOptions).setData(item, { manual: true })
  })

  return response
}

async function fetchNft(blockchain: TBlockchainServiceKey, tokenHash?: string, collectionHash?: string) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  if (!hasNft(blockchainService) || !tokenHash) return

  return await blockchainService.nftDataService.getNft({ tokenHash, collectionHash })
}

export const useNftsQuery = (account: TAccount) => {
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)
  const queryClient = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: ['nfts', account.blockchain, account.address, selectedNetwork],
    queryFn: ({ pageParam }) => fetchNfts(account, selectedNetwork, queryClient, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextPageParams,
  })

  const aggregatedData = useMemo(() => query.data?.pages?.flatMap(page => page.items) || [], [query.data])

  return { aggregatedData, ...query }
}

export const useNftQuery = (blockchain: TBlockchainServiceKey, tokenHash?: string, collectionHash?: string) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    enabled: !!tokenHash,
    queryKey: buildUniqueQueryKey(blockchain, selectedNetwork, tokenHash, collectionHash),
    queryFn: fetchNft.bind(null, blockchain, tokenHash, collectionHash),
  })
}
